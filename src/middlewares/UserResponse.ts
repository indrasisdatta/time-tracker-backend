import { NextFunction, Request, Response } from "express";
import { API_STATUS } from "../config/constants";
import { Model } from "mongoose";
import { logger } from "../utils/logger";

export const UserResponse = (
  req: Request,
  res: Response,
  Next: NextFunction
) => {
  try {
    if (res.locals?.apiResponse) {
      if (
        res.locals.apiResponse?.status == 1 &&
        typeof res.locals.apiResponse?.data === "object" &&
        res.locals.apiResponse?.data.constructor.modelName === "User"
      ) {
        const tempUser = res.locals.apiResponse?.data.toObject();
        delete tempUser._id;
        delete tempUser.createdAt;
        delete tempUser.updatedAt;
        delete tempUser.password;
        delete tempUser?.__v;
        return res.status(200).json({
          status: res.locals.apiResponse?.status,
          data: tempUser,
        });
      }
    }
    return res.status(200).json(res.locals);
  } catch (error) {
    logger.error("After middleware error UserResponse: ", error);
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};
