import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let refreshToken: string = req.body.refreshtoken;


  // try{
  //   let url = "https://accounts.spotify.com/api/token"

  //   let response = await axios.post(
  //     url,
  //     {
  //       grant_type: "refresh_token",
  //       refresh_token: refreshToken,
  //       client_id: process.env.SPOTIFY_CLIENT_ID,
  //       client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  //     }
  //   );
  //   res.status(200).json({ message: "success" });
  // } catch (err) {
  //   res.status(500).json({ message: "error" });
  // }

  res.status(200).json({ message: "success" });
}

