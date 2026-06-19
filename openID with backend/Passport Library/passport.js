import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_REDIRECT_URI,
        },
        (accessToken, refreshToken, profile, cb) => {
            return cb(null, profile);
        },
    ),
);


// Undisputedly we will not use this(passport) Library in our Storage Because the way it uses to fetch the user info is slow.` 

// why its slow because it uses access_Token and make one extra request to fetch, even though it can decode user info from id_Token but it does not do.

// while In my opinion `google-auth-library` is far good and lean enough till we are authicating user with google only, if we want our user