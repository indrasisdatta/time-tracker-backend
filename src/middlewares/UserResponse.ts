import { NextFunction, Request, Response } from "express";

export const UserResponse = (
  req: Request,
  res: Response,
  Next: NextFunction
) => {
  req;
  res;
  // return res.status(200).json({
  //     status: API_STATUS.SUCCESS,
  //     data: user,
  //   });
};
