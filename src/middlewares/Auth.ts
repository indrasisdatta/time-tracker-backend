import { API_STATUS } from "../config/constants";
import passport from "../passport";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/User";

/* Authenticate access token */
export const Auth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    // "jwt",
    process.env.JWT_ACCESS_TOKEN_KEY!,
    { session: false },
    async (error: Error, user: IUser) => {
      console.log("Auth response middleware: ", error, user);
      if (error || !user) {
        return res.status(401).json({
          status: API_STATUS.ERROR,
          data: null,
          error: "Unauthorized access",
        });
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
};

/* Authenticate refresh token */
export const AuthRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    // "jwt",
    process.env.JWT_REFRESH_TOKEN_KEY!,
    { session: false },
    async (error: Error, user: IUser) => {
      console.log("AuthRefreshToken response middleware: ", error, user);
      if (error || !user) {
        return res.status(403).json({
          status: API_STATUS.ERROR,
          data: null,
          error: "Unauthorized access",
        });
      }
      req.user = user;
      return next();
    }
  )(req, res, next);
};
