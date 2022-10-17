import type { NextApiRequest, NextApiResponse } from "next";
import passport from "passport";
import "../../../../lib/passport";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //create database connection
  //redriect user to twitch auth with scopes
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private", "streaming", "user-modify-playback-state"],
    session: false,
  })(req, res);
}
