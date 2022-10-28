import { setCookie } from "cookies-next";
import passport from "passport";
import "../../../../lib/passport";
import connect from "../../../../lib/database";
import next, { NextApiRequest, NextApiResponse } from "next";
import { NextIncomingMessage } from "next/dist/server/request-meta";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextIncomingMessage
) {
  passport.authenticate("spotify", (err, user, info) => {
    if (err || !user) {
      return res.redirect("http://localhost:3000/?a=auth_fail");
    }

    // set cookie and send redirect
    setCookie("spotifycookie", info.token, {
      req,
      res,
    });
    res.status(200).redirect("http://localhost:3000");
  })(req, res, next);
}
