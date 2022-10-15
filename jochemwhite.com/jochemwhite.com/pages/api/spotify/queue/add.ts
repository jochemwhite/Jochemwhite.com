import axios from "axios";
import { getCookie } from "cookies-next";
import Spotify from "models/Spotify";
import { NextApiRequest, NextApiResponse } from "next";
import { Cookies } from "next/dist/server/web/spec-extension/cookies";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export default async function <NextApiHandler>(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let trackID: string = req.body.trackID;
  //get cookies from client
  const SpotifyToken: any = getCookie("spotifycookie", { req, res });

  const Spotifyverified = jwt.verify(
    SpotifyToken,
    process.env.JWT_SECRET
  ) as JwtPayload;

  //fetch accestoken from database
  let db = await Spotify.findOne({ _id: Spotifyverified.id });

  //add song to queue
  let response: boolean = await addtoQueue(db!.accessToken, trackID);

  if(!response){
    res.status(500).send("error");
  }

  //get song info
  let songInfo = await info(db!.accessToken, trackID);


  //add song to database
  await addtoDB(songInfo, Spotifyverified.id);

  res.status(200).send("success");


}

//add song to queue
async function addtoQueue(accessToken: string, trackID: string) {
  try {
    let response = await axios.post(
      `https://api.spotify.com/v1/me/player/queue?uri=${trackID}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    console.log(response);
    return true;
  } catch (err: any) {
    console.log(err.response.data);
    return false;
  }
}

//get song info
async function info(accessToken: string, trackID: string) {
  let id = trackID.split(":")[2];
  try {
    let response = await axios.get(
      `https://api.spotify.com/v1/tracks/${id}`,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    console.log(err.response.data);
    return err.response;
  }
}
  
//add song to database
async function addtoDB(track:any ,id: any) {
  console.log(id);

  let db = await Spotify.findOne({ _id: id });
  let queue = db!.queue;
  queue!.push({
    song: track.name,
    artist: track.artists[0].name,
    duration: track.duration_ms,
    uri: track.uri,
    image: track.album.images[0].url,
    addedAt: new Date(),
  },
  
  );
  await Spotify.updateOne({ _id: id }, { queue: queue });
}
