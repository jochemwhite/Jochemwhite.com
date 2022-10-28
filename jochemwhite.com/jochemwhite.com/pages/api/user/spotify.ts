import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";

import type { NextApiRequest, NextApiResponse } from "next";
import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import prisma from "@/lib/database";
type Data = {
  message: string;
  user?: {
    twitchID: number;
    username: string;
    email: string;
  };
  token?: string;
};

interface JwtPayload {
  id: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const SpotifyToken: any = getCookie("spotifycookie", { req, res });

  //if we dont have cookies
  if (!SpotifyToken) {
    res.status(401).json({ message: "not authorized" });
    return;
  }

  const Spotifyverified = jwt.verify(
    SpotifyToken,
    process.env.JWT_SECRET
  ) as JwtPayload;

  const Sportifyobj = await prisma.user.findUnique({
    where: {
      id: Spotifyverified.id,
    },
    include: {
      spotify: true,
    },
  });

  if (!Sportifyobj) {
    res.status(401).json({
      message: "not authorized",
    });
    return;
  }

  let accessToken = Sportifyobj.spotify!.accessToken;
  let refreshToken = Sportifyobj.spotify!.refreshToken;

  let user = await userData(accessToken);

  if (user.error) {
    let newTokens = await refreshaccessToken(refreshToken);
    let test = await prisma.user.update({
      where: {
        id: Sportifyobj.id,
      },
      data: {
        spotify: {
          update: {
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
          },
        },
      },
      include:{
        spotify:true
      }
    });

    accessToken = newTokens.access_token;
    refreshToken = newTokens.refresh_token;
    user = await userData(newTokens.access_token);
  }

  res.status(200).json({ message: "success", user: user, token: accessToken });
};

async function userData(accessToken: string) {
  try {
    let res: AxiosResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    return res.data;
  } catch (err: any) {
    return err.response.data;
  }
}

async function refreshaccessToken(refreshToken: string) {
  const URL = "https://accounts.spotify.com/api/token";

  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  // header paremeter
  const config = {
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  // request body parameter
  const data = new URLSearchParams([
    ["grant_type", "refresh_token"],
    ["refresh_token", refreshToken],
  ]).toString();

  try {
    let res: AxiosResponse = await axios.post(URL, data, config);

    return res.data;
  } catch (err: any) {
    return err.response;
  }
}
