import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  let deviceID: string = req.body.deviceID;
  let accessToken: string = req.body.accestoken;


  try {
    let ressponse: AxiosResponse = await axios.put(
      "https://api.spotify.com/v1/me/player",
      {
        device_ids: [deviceID],
      },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    res.status(200).json({ message: "success" });
  } catch (err: any) {
    res.status(500).json({ message: "error" });
  }
}
