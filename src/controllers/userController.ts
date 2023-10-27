import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { API_STATUS } from "../config/constants";
import { User } from "../models/User";
import passport from "passport";

export const signupSave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info("Sign up:");
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    const usr = await user.save();
    if (usr) {
      return res.status(200).json({ status: API_STATUS.SUCCESS, data: usr });
    }
    res.status(400).json({ status: API_STATUS.ERROR, data: null });
  } catch (error) {
    logger.info(`Signup error: ${JSON.stringify(error)}`);
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

export const signinUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const pass = await passport.authenticate("local", { session: false })(
      req,
      res
    );

    console.log(pass);
    // , (err, user, info) => {
    //   console.log("Passport authenticate");
    // });

    res.status(400).json({ status: API_STATUS.ERROR, data: null });
  } catch (error) {
    logger.info(`Signup error: ${JSON.stringify(error)}`);
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};