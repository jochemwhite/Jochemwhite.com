import type { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";
import "../../../../lib/passpor";
import connect from "../../../../lib/database";
// import connect from "@lib/database"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //create database connection
  await connect();
  //redriect user to twitch auth with scopes
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private", "streaming", "user-modify-playback-state"],
    session: false,
  })(req, res);
}
