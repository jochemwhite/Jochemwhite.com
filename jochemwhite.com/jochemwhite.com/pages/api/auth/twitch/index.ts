import type { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";
import "../../../../lib/passport";
// import connect from "@lib/database"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //create database connection
  //redriect user to twitch auth with scopes
  passport.authenticate("twitch", {
    scope: [
      "user_read",
      "user:read:email",
      "chat:edit",
      "chat:read",
      "channel:read:redemptions",
      "channel:read:goals",
    ],
    session: false,
  })(req, res);
}
