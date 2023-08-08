import { Request, Response, NextFunction } from "express";
import {
  categorySchema,
  timesheetSchema,
  timesheetSummarySchema,
} from "./validationSchema";
import { API_STATUS } from "../config/constants";
import { logger } from "../utils/logger";

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
        error: err,
      });
    }
  };
};
