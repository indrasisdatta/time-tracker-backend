import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "./models/User";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { IUser } from "./types/User";
import { Request } from "express";

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//     },
//     async function (email, password, cb) {
//       try {
//         const user = await User.findOne({ email });
//         if (!user) {
//           return cb(null, false, { message: "Incorrect email." });
//         }
//         const validate = await user.isValidPassword(password);
//         if (!validate) {
//           return cb(null, false, { message: "Invalid password." });
//         }

//         return cb(null, user, { message: "Login successful." });
//       } catch (e) {
//         return cb(e);
//       }
//     }
//   )
// );

passport.use(
  "x-access-token",
  new JwtStrategy(
    {
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromHeader("x-access-token"),
      jwtFromRequest: tokenExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, cb) {
      console.log("Access token jwtPayload", jwtPayload);
      try {
        const user = await User.findById(jwtPayload.id).select({
          __v: 0,
          password: 0,
        });
        if (user) {
          return cb(null, user);
        }
        return cb(null, false);
      } catch (error) {
        console.log("Access token error", error);
        return cb(error);
      }
    }
  )
);

passport.use(
  "x-refresh-token",
  new JwtStrategy(
    {
      // jwtFromRequest: ExtractJwt.fromHeader("x-refresh-token"),
      jwtFromRequest: tokenExtractor,
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, cb) {
      console.log("Refresh token jwtPayload", jwtPayload);
      try {
        const user = await User.findById(jwtPayload.id).select({
          __v: 0,
          password: 0,
        });
        if (user) {
          return cb(null, user);
        }
        return cb(null, false);
      } catch (error) {
        console.log("Refresh token error", error);
        return cb(error);
      }
    }
  )
);

function tokenExtractor(req: Request) {
  let token = null;
  if (req.headers.authorization) {
    let parts = req.headers.authorization.split(" ");
    if (parts.length == 2) {
      let scheme = parts[0],
        credentials = parts[1];
      if (
        /^x-access-token$/i.test(scheme) ||
        /^x-refresh-token$/i.test(scheme)
      ) {
        token = credentials;
      }
      console.log("Token extracted: ", scheme, token);
    }
  }
  return token;
}

export default passport;
