import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import User from "../models/User";
import { VerifyCallback } from "passport-oauth2";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    //in the following function we define what to do when we have verified that the user is a valid google user
    async (
      _accessToken: String,
      _refreshToken: String,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        console.log("checking db....");
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          console.log("saving in db....")
          user = await User.create({
            name: profile.displayName,
            email: profile.emails?.[0].value,
            googleId: profile.id,
            avatar: profile.photos?.[0].value,
          });
        }

        done(null, user);
      } catch (error: unknown) {
        done(error as Error);
      }
    }
  )
);
