import { API_STATUS } from "../config/constants";
import passport from "../passport";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/User";

export const Auth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error: Error, user: IUser) => {
      if (error || !user) {
        return res.status(400).json({
          status: API_STATUS.ERROR,
          data: null,
          error: "Unauthorized access",
        });
      }
      req.user = user;
      next();
    }
  )(req, res, next);
};
