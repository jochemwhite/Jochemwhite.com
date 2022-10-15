import mongoose, { Schema, model, connect, Model } from "mongoose";

interface ISpotify {
  SpotifyID: string;
  name: string;
  email: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
  queue?: {
    song: string;
    artist: string;
    duration: number;
    uri: string;
    image: string;
    addedBy?: {
      displayName: string;
      avatar: string;
      id: number;
    };
    addedAt: Date;
  }[];
  tokens: string[];
}

const spotifySchema = new Schema<ISpotify>(
  {
    SpotifyID: String,
    name: String,
    email: String,
    avatar: String,
    accessToken: String,
    refreshToken: String,
    queue: [
      {
        song: String,
        artist: String,
        duration: Number,
        uri: String,
        image: String,
        addedBy: {
          displayName: String,
          avatar: String,
          id: Number,
        },
        addedAt: String,
      } as any,
    ],
    tokens: [String],
  },
);

let Spotify: Model<ISpotify>;

try {
  Spotify = model<ISpotify>("SpotifyUsers");
} catch (err) {
  console.log(err);
  Spotify = model<ISpotify>("SpotifyUsers", spotifySchema);
}

export default Spotify as mongoose.Model<ISpotify>;
