import axios from "axios";
import { getCookie } from "cookies-next";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import prisma from "@/lib/database";

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
  let db = await prisma.user.findUnique({
    where: {
      id: Spotifyverified.id,
    },
    include: {
      spotify: true,
      twitch: true,
    },
  });

  let accessToken = db!.spotify!.accessToken;

  //add song to queue
  let response: boolean = await addtoQueue(accessToken, trackID);

  if (!response) {
    res.status(500).send("error");
  }

  //get song info
  let songInfo = await info(accessToken, trackID);

  //add song to database
  await addtoDB(songInfo, db);

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
    return true;
  } catch (err: any) {
    return false;
  }
}

//get song info
async function info(accessToken: string, trackID: string) {
  let id = trackID.split(":")[2];
  try {
    let response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    return response.data;
  } catch (err: any) {
    return err.response;
  }
}

//add song to database
async function addtoDB(track: any, db: any) {
  console.log(db);

  console.log("------------------------------------");

  await prisma.queue.create({
    data: {
      addedAt: new Date(),
      song: track.name,
      artists: track.artists[0].name,
      channelID: +db.twitch!.twitchID,
      channelName: db.twitch!.displayName,
      songID: track.id,
      duration: track.duration_ms,
      image: track.album.images[0].url,
      requestedBy: db.twitch!.displayName,
      uri: track.uri,
      spotifyId: db.spotify!.spotifyID,
    },
  });
}
