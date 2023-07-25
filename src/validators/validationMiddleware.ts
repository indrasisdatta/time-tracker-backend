import { Request, Response, NextFunction } from "express";
import { categorySchema } from "./validationSchema";
import { API_STATUS } from "../config/constants";
import { logger } from "../utils/logger";

export const validationMiddleware = (op: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let schema;
    switch (op) {
      case "category":
        schema = categorySchema;
        break;
      case "editCategory":
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
    } catch (e: any) {
      logger.error(`validationResult exception:`, e);
      let err;
      if (e.hasOwnProperty("details")) {
        err = e.details.map((err: any) => err.message);
      } else if ((e as Error).hasOwnProperty("message")) {
        err = [e.message];
      }
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: err,
      });
    }
    next();
  };
};
