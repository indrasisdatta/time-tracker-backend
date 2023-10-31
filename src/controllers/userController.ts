import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { API_STATUS } from "../config/constants";
import { User } from "../models/User";
import passport from "passport";
import jwt from "jsonwebtoken";
import { IUser } from "../types/User";

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
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: "Incorrect email.",
        data: null,
      });
    }
    const validate = await user.isValidPassword(password);
    if (!validate) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: "Invalid password.",
        data: null,
      });
    }
    /* Valid user, so generate access and refresh token */
    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        expire: Date.now() + 3600 * Number(process.env.JWT_ACCESS_TOKEN_EXPIRY),
      },
      process.env.JWT_SECRET!
    );
    const refreshToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        expire:
          Date.now() + 3600 * Number(process.env.JWT_REFRESH_TOKEN_EXPIRY),
      },
      process.env.JWT_SECRET!
    );

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      data: { accessToken, refreshToken },
    });
  } catch (error) {
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        data: null,
        error: "User not found",
      });
    }
    // let tempUser = { ...user };
    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};
