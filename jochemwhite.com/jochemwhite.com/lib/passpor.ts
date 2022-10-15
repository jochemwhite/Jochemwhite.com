import passport from "passport";
import { Strategy as twitchStrategy } from "@d-fischer/passport-twitch";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import Spotify from "../models/Spotify";
import Twitch from "../models/Twitch";
import jwt from "jsonwebtoken";
import connect from "./database";

//twitch
passport.use(
  "twitch",
  new twitchStrategy(
    {
      clientID: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/twitch/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      connect();
      try {
        //check if we this user in the database
        const obj = await Twitch.findOne({ TwitchID: profile.id });
        //if we can't find the user we create it

        console.log(obj);

        if (!obj) {
          const newUser = new Twitch({
            TwitchID: profile.id,
            name: profile.display_name,
            email: profile.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
          });
          await newUser.save();
          //create a new JWTtoken/cookie
          const token = jwt.sign(
            {
              id: newUser._id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          //add the token to the database
          newUser.tokens.push(token);
          await newUser.save();
          done(null, newUser, { message: "Auth successful", token });
        }
        //if the user exist
        else {
          const token = jwt.sign(
            {
              id: obj._id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          obj?.tokens.push(token);
          await obj.save();
          done(null, obj, { message: "Auth successful", token });
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

//spotify
passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/spotify/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const obj = await Spotify.findOne({ SpotifyID: profile.id });
        if (!obj) {
          // create new user
          const newUser = new Spotify({
            SpotifyID: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            accessToken,
            refreshToken,
            queue: ["dit is een test"],
          });
          await newUser.save();
          const token = jwt.sign(
            {
              id: newUser._id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          newUser.tokens.push(token);
          await newUser.save();
          done(null, newUser, { message: "Auth successful", token });
        } else {
          // login existing user
          const token = await jwt.sign(
            {
              id: obj._id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          obj.tokens.push(token);
          await obj.save();
          done(null, obj, { message: "Auth successful", token });
        }
      } catch (err) {
        console.error(err);
        done(err, false, { message: "Internal server error" });
      }
    }
  )
);
