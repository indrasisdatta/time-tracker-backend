import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "./models/User";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { IUser } from "./types/User";

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
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async function (jwtPayload, cb) {
      console.log("jwtPayload", jwtPayload);
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
        return cb(error);
      }
    }
  )
);

export default passport;
