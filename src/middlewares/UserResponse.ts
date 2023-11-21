import { NextFunction, Request, Response } from "express";
import { API_STATUS } from "../config/constants";
import { logger } from "../utils/logger";
import { userObjWithImageURL } from "../utils/helpers";

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
        let tempUser = res.locals.apiResponse?.data.toObject();
        /* Delete private fields */
        delete tempUser._id;
        delete tempUser.createdAt;
        delete tempUser.updatedAt;
        delete tempUser.password;
        delete tempUser?.__v;
        /* Provide absolute URL for profile image */
        tempUser = userObjWithImageURL(req, tempUser);
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
