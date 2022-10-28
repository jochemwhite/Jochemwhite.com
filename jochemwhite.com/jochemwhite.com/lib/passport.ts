import passport from "passport";
import { Strategy as twitchStrategy } from "@d-fischer/passport-twitch";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import jwt from "jsonwebtoken";
import prisma from "./database";
import { NextApiRequest } from "next";

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
      try {
        //check if we this user in the database
        // const obj = await Twitch.findOne({ TwitchID: profile.id });
        const obj = await prisma.user.findFirst({
          where: {
            twitch: {
              twitchID: +profile.id,
            },
          },
        });

        //if we can't find the user we create it

        if (!obj) {
          let newUser = await prisma.user.create({
            data: {
              name: profile.display_name,
              twitch: {
                create: {
                  twitchID: +profile.id,
                  displayName: profile.display_name,
                  email: profile.email,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                },
              },
            },
          });

          //create a new JWTtoken/cookie
          const token = jwt.sign(
            {
              id: newUser.id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );
          //add the token to the database

          await prisma.user.update({
            where: {
              id: newUser.id,
            },
            data: {
              JWT: {
                create: {
                  twitch: token,
                },
              },
            },
          });

          done(null, newUser, { message: "Auth successful", token });
        }
        //if the user exist
        else {
          const token = jwt.sign(
            {
              id: obj.id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );

          await prisma.user.update({
            where: {
              id: obj.id,
            },
            data: {
              JWT: {
                update: {
                  twitch: token,
                },
              },
            },
          });
          prisma.$disconnect();
          done(null, obj, { message: "Auth successful", token });
        }
      } catch (err) {
        console.log(err)
        prisma.$disconnect();
      }
    }
  )
);

// spotify
passport.use(
  "spotify",
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/spotify/callback",
      passReqToCallback: true,
    },
    async (
      req: NextApiRequest,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      let token = req.cookies.twitchcookie!;
      console.log(profile);

      const verify = jwt.verify(token, process.env.JWT_SECRET) as any;
      try {
        const obj = await prisma.user.findFirst({
          where: {
            id: verify.id,
          },
          include: {
            spotify: true,
          },
        });

        if (!obj!.spotify) {
          console.log("new spotify user");
          let spotifyID = profile.id;
          let newUser = await prisma.user.update({
            where: {
              id: obj!.id,
            },
            data: {
              spotify: {
                create: {
                  spotifyID: spotifyID,
                  displayName: profile.displayName,
                  email: profile.emails[0].value,
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                },
              },
            },
            include: {
              // twitch: true,
              spotify: true,
            },
          });

          const token = jwt.sign(
            {
              id: newUser.id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );

          await prisma.user.update({
            where: {
              id: obj!.id,
            },
            data: {
              JWT: {
                update: {
                  spotify: token,
                },
              },
            },
          });
          prisma.$disconnect();
          console.log(profile);
          done(null, newUser, { message: "Auth successful", token });
        } else {
          // login existing user
          const token = jwt.sign(
            {
              id: obj!.id,
              created: Date.now().toString(),
            },
            process.env.JWT_SECRET
          );

          await prisma.user.update({
            where: {
              id: obj!.id,
            },
            data: {
              spotify: {
                update: {
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                },
              },
              JWT: {
                update: {
                  spotify: token,
                },
              },
            },
          });

          done(null, obj, { message: "Auth successful", token });
        }
      } catch (err) {
        console.error(err);
        done(err, false, { message: "Internal server error" });
      }
    }
  )
);
