import { CookieValueTypes, getCookie } from "cookies-next";
import connect from "../../../lib/database";
import jwt from "jsonwebtoken";
import { NextApiHandler } from "next";
import prisma from "../../../lib/database";

import type { NextApiRequest, NextApiResponse } from "next";
import { Cookies } from "next/dist/server/web/spec-extension/cookies";

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
  const TwitchToken: any = getCookie("twitchcookie", { req, res });

  // console.log(TwitchToken);
  //if we dont have cookies
  if (!TwitchToken) {
    res.status(401).json({ message: "not authorized" });
    return;
  }

  const Twitchverified = jwt.verify(TwitchToken, process.env.JWT_SECRET) as any;


  
  const Twitchobj = await prisma.user.findFirst({
    where: {
      id: Twitchverified.id
    },
    include: {
      twitch: true,
    },
  });

  console.log(`in user file ${Twitchobj}`);

  if (!Twitchobj) {
    res.status(401).json({
      message: "not authorized",
    });
    return;
  }

  prisma.$disconnect()

  res.status(200).json({
    message: 'authorized',
    user: {
      twitchID: Twitchobj!.twitch.twitchID,
      username: Twitchobj!.twitch.displayName,
      email: Twitchobj!.twitch.email,
      accessToken: Twitchobj!.twitch.accessToken,
      refreshToken: Twitchobj!.twitch.refreshToken
    }
  })
};
