import { getCookie } from "cookies-next";
import connect from "../../../lib/database";
import Twitch from "../../../models/Twitch";
import jwt from "jsonwebtoken";
import { NextApiHandler } from "next";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
  user?: {
    twitchID: number;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  };
};

interface JwtPayload {
  id: string;
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  connect();
  const TwitchToken: any = getCookie("twitchcookie", { req, res });

  // console.log(TwitchToken);
  //if we dont have cookies
  if (!TwitchToken) {
    res.status(401).json({ message: "not authorized" });
    return;
  }

  const Twitchverified = jwt.verify(
    TwitchToken,
    process.env.JWT_SECRET
  ) as JwtPayload;

  const Twitchobj = await Twitch.findOne({ _id: Twitchverified.id });

  if (!Twitchobj) {
    res.status(401).json({
      message: "not authorized",
    });
    return;
  }


  res.status(200).json({
    message: "authorized",
    user: {
      twitchID: Twitchobj.TwitchID,
      username: Twitchobj.name,
      email: Twitchobj.email,
      accessToken: Twitchobj.accessToken,
      refreshToken: Twitchobj.refreshToken,
    },
  });
};
