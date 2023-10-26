import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "./models/User";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, cb) {
      try {
        const user = await User.findOne({ email, password });
        if (!user) {
          return cb(null, false, { message: "Incorrect email or password." });
        }
        return cb(null, user, { message: "Login successful." });
      } catch (e) {
        return cb(e);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, cb) {
      try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
          return cb(null, user);
        }
        return cb(null, false);
      } catch (e) {
        return cb(e, false);
      }
    }
  )
);
