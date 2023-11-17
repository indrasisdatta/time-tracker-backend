import { Request, Response, NextFunction } from "express";
import {
  categorySchema,
  changePwdSaveSchema,
  editProfileSaveSchema,
  forgotPwdSchema,
  reportSearchSchema,
  resetPwdSaveSchema,
  signupUserSchema,
  timesheetSchema,
  timesheetSummarySchema,
} from "./validationSchema";
import { API_STATUS } from "../config/constants";
import { logger } from "../utils/logger";
import { removeFile } from "../utils/helpers";

export const validationMiddleware = (op: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let schema;
    switch (op) {
      case "category":
        schema = categorySchema;
        break;
      case "timesheet":
        schema = timesheetSchema;
        break;
      case "timesheet_summary":
        schema = timesheetSummarySchema;
        break;
      case "report_search":
        schema = reportSearchSchema;
        break;
      case "user_signup":
        schema = signupUserSchema;
        break;
      case "forgot_pwd":
        schema = forgotPwdSchema;
        break;
      case "reset_pwd":
        schema = resetPwdSaveSchema;
        break;
      case "change_pwd":
        schema = changePwdSaveSchema;
        break;
      case "edit_profile":
        schema = editProfileSaveSchema;
        break;
    }
    if (!schema) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: "Invalid request schema",
      });
    }
    try {
      const validationResult = await schema.validateAsync(req.body, {
        abortEarly: false,
        context: { req },
      });
      logger.info(`validationResult:`, validationResult);
      next();
    } catch (e: any) {
      logger.error(`validationResult exception:`, e);
      if (req?.file?.filename) {
        removeFile(req?.file?.filename);
        removeFile(process.env.THUMB_PREFIX + req?.file?.filename);
      }
      let err;
      if (e.hasOwnProperty("details")) {
        err = e.details.map((err: any) => {
          /* Normal fields */
          if (!err.path || err.path?.length == 1) {
            return err.message;
          }
          /* Nested fields - show row no */
          return `Row #${err.path[1] + 1}: ${err.message}`;
        });
      } else if ((e as Error).hasOwnProperty("message")) {
        err = [e.message];
      }
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: [...new Set(err)],
      });
    }
  };
};
