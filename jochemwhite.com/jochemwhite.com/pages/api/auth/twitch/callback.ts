import { setCookie } from "cookies-next";
import passport from "passport";
import "../../../../lib/passport";
import next, { NextApiRequest, NextApiResponse } from "next";
import { NextIncomingMessage } from "next/dist/server/request-meta";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  await passport.authenticate("twitch", async (err, user, info) => {
    if (err || !user) {
      return res.redirect("http://localhost:3000/?a=auth_fail");
    }
    // set cookie and send redirect
    setCookie("twitchcookie", info.token, {
      req,
      res,
    });

    return res.status(200).redirect("http://localhost:3000");
  })(req, res);
}
