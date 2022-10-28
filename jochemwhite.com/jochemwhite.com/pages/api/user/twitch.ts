import { CookieValueTypes, getCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/database";
import axios, { AxiosResponse } from "axios";

import { refreshTwitch } from "@/lib/refreshTokens/refreshTwitch";

import type { NextApiRequest, NextApiResponse } from "next";
import { Cookies } from "next/dist/server/web/spec-extension/cookies";

type Data = {
  message: string;
  user?: {
    twitchID: number;
    username: string;
    email: string;
    broadcaster_type: string;
    profiel_img: string;
    description: string;
    created_at: string;
    accessToken: string;
    refreshToken: string;
  };
};

interface JwtPayload {
  id: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const TwitchToken: any = getCookie("twitchcookie", { req, res });

  //if we dont have cookies
  if (!TwitchToken) {
    res.status(401).json({ message: "not authorized" });
    return;
  }

  const Twitchverified = jwt.verify(TwitchToken, process.env.JWT_SECRET) as any;

  const Twitchobj = await prisma.user.findFirst({
    where: {
      id: Twitchverified.id,
    },
    include: {
      twitch: true,
    },
  });

  if (!Twitchobj) {
    res.status(401).json({
      message: "not authorized",
    });
    prisma.$disconnect();
    return;
  }

  prisma.$disconnect();

  let TwitchUser = await getUser(
    Twitchobj!.twitch.accessToken,
    Twitchobj!.twitch.twitchID
  );

  if (TwitchUser === 401) {
    console.log("IN 401 ");

    let refresh_token = Twitchobj.twitch.refreshToken;
    let userID = Twitchobj.id;

    let new_token = await refreshTwitch(refresh_token, userID);

    console.log(new_token);

    TwitchUser = await getUser(new_token, Twitchobj!.twitch.twitchID);
  }

  let user = TwitchUser[0];

  res.status(200).json({
    message: "authorized",
    user: {
      twitchID: user.id,
      username: user.display_name,
      email: user.email,
      broadcaster_type: user.broadcaster_type,
      created_at: user.created_at,
      description: user.description,
      profiel_img: user.profile_image_url,
      accessToken: Twitchobj!.twitch.accessToken,
      refreshToken: Twitchobj!.twitch.refreshToken,
    },
  });
};

async function getUser(accessToken: string, userID: number) {
  try {
    let res: AxiosResponse = await axios.get(
      `https://api.twitch.tv/helix/users?id=${userID}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
      }
    );
    return res.data.data;
  } catch (err: any) {
    let status = err.response.data.status;
    return status;
  }
}
