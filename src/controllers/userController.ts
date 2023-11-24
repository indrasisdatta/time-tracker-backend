import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import { API_STATUS } from "../config/constants";
import { User, UserModel } from "../models/User";
// import passport from "passport";
import jwt from "jsonwebtoken";
import { IUser } from "../types/User";
import { Mailer } from "../utils/mailer";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import { v4 as uuidv4 } from "uuid";
import { ResetPwdToken } from "../models/ResetPwdToken";
import {
  convertHtmlToText,
  removeFile,
  userObjWithImageURL,
} from "../utils/helpers";
import { ClientSession, Document, startSession } from "mongoose";
import { generateThumbnail } from "../config/sharpConfig";
import path from "path";

/* User sign up */
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

/* User login */
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

    const {
      firstName,
      lastName,
      role,
      profileImage,
    }: {
      firstName: string;
      lastName: string;
      role: string;
      profileImage: string;
    } = {
      ...user.toObject(),
    };

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      data: {
        accessToken,
        refreshToken,
        userInfo: userObjWithImageURL(req, {
          firstName,
          lastName,
          email,
          role,
          profileImage,
        }),
      },
    });
  } catch (error) {
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

/* Forgot pwd (save token and email pwd reset link) */
export const forgotPwdAction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log('Client url: ', clientUrl);
    const user = await User.isExistingEmail(req.body.email);
    // console.log("User found: ", user);
    if (!user) {
      return res
        .status(400)
        .json({ status: API_STATUS.ERROR, error: "User not found" });
    }
    /* Save reset password token for this user */
    let resetTokenObj = await ResetPwdToken.findOne({ user: user._id });
    if (!resetTokenObj) {
      resetTokenObj = await new ResetPwdToken({
        token: uuidv4(),
        user: user._id,
      }).save();
    }

    /* Generate reset password email template */
    const resetHtml = await readFileSync("emailTemplates/resetPassword.html", {
      encoding: "utf-8",
    });
    const resetUrl = `${process.env.CLIENT_BASE_URL}/auth/reset-password/${resetTokenObj.token}`;
    const resetTemplate = Handlebars.compile(resetHtml)({
      firstName: user.firstName,
      resetUrl,
    });

    /* Send reset password email */
    const mailer = Mailer.getInstance();
    await mailer.createConnection();
    const mailStatus = await mailer.sendMail({
      to: user.email,
      subject: "Reset your password",
      text: convertHtmlToText(resetTemplate),
      html: resetTemplate,
    });
    // console.log("mailStatus", mailStatus);
    res.status(200).json({ status: API_STATUS.SUCCESS, data: resetTokenObj });
  } catch (error) {
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

/* Validate reset token */
export const resetPasswordTokenCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resetToken } = req.params;

    const existingToken = await ResetPwdToken.findOne({
      token: resetToken,
    }).populate("user", "_id email firstName lastName");
    if (existingToken) {
      return res
        .status(200)
        .json({ status: API_STATUS.SUCCESS, data: existingToken });
    }
    res.status(400).json({
      status: API_STATUS.ERROR,
      error: `Reset password  URL is either invalid or expired already.`,
    });
  } catch (error) {
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

/* Reset pwd DB save */
export const resetPasswordSave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session: ClientSession = await startSession();
  session.startTransaction();
  try {
    /* DB save password  */
    const { resetToken, password } = req.body;
    const existingToken = await ResetPwdToken.findOne({
      token: resetToken,
    }).populate("user");
    if (!existingToken) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: `Reset password  URL is either invalid or expired already.`,
      });
    }
    existingToken.user.password = password;
    await (existingToken.user as any).save();

    /* Delete data from resetPassword collection */
    await ResetPwdToken.findOneAndDelete({
      token: resetToken,
    });
    await session.commitTransaction();

    return res.status(200).json({
      status: API_STATUS.SUCCESS,
      data: 1,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ status: API_STATUS.ERROR, error });
  } finally {
    session.endSession();
  }
};

/* Change pwd DB save */
export const changePasswordSave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /* DB save password  */
    const { password } = req.body;
    console.log("Request body", req.body, req.user);
    if (!req.user) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: `Invalid request.`,
      });
    }
    (req.user as IUser).password = password;
    const savedUser = await (req.user as Document).save();

    res.status(200).json({
      status: API_STATUS.SUCCESS,
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

export const regenerateTokens = async (
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
        error: "Invalid request",
      });
    }
    /* Valid user, so generate access and refresh token */
    const accessToken = jwt.sign(
      {
        id: (user as IUser)._id,
        email: (user as IUser).email,
        expire: Date.now() + 60,
        // expire: Date.now() + 3600 * Number(process.env.JWT_ACCESS_TOKEN_EXPIRY),
      },
      process.env.JWT_SECRET!
    );
    const refreshToken = jwt.sign(
      {
        id: (user as IUser)._id,
        email: (user as IUser).email,
        expire: Date.now() + 600 * Number(process.env.JWT_REFRESH_TOKEN_EXPIRY),
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

/* User profile details */
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
    res.locals.apiResponse = {
      status: API_STATUS.SUCCESS,
      data: user,
    };
    next();
  } catch (error) {
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

/* Edit profile */
export const editProfileSave = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user: jwtUser } = req;
    if (!jwtUser) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        data: null,
        error: "User not found",
      });
    }
    const user = await User.findById((jwtUser as IUser)._id);
    if (!user) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        data: null,
        error: "User not found",
      });
    }
    const { firstName, lastName, email } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    if (req.file) {
      /* Remove old image before uploading new one */
      if (user.profileImage) {
        removeFile(user.profileImage);
        removeFile(process.env.THUMB_PREFIX + user.profileImage);
      }
      /* Set profile image name and generate thumb */
      user.profileImage = req.file.filename;
      const filepath = path.join(
        process.env.FILE_UPLOAD_FOLDER!,
        req.file.filename
      );
      await generateThumbnail(filepath, req.file.filename, 100, 100);
    }
    const savedUser = await user.save();
    res.locals.apiResponse = {
      status: API_STATUS.SUCCESS,
      data: savedUser,
    };
    next();
  } catch (error) {
    logger.error("Exception caught: ", error);
    /* If any exception is thrown while saving, remove uploaded files */
    if (req?.file?.filename) {
      removeFile(req?.file?.filename);
      removeFile(process.env.THUMB_PREFIX + req?.file?.filename);
    }
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};
