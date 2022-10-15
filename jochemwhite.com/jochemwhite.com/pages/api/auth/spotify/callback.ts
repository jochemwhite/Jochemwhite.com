import { setCookie } from "cookies-next";
import passport from "passport";
import "../../../../lib/passpor";
import connect from "../../../../lib/database";
import next, { NextApiRequest, NextApiResponse } from "next";
import { NextIncomingMessage } from "next/dist/server/request-meta";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextIncomingMessage
) {
  await connect();
  passport.authenticate("spotify", (err, user, info) => {
    if (err || !user) {
      console.log(err);
      return res.redirect("http://localhost:3000/?a=auth_fail");
    }

    // set cookie and send redirect
    setCookie("spotifycookie", info.token, {
      req,
      res,
    });
    res.redirect("http://localhost:3000");
  })(req, res, next);
}