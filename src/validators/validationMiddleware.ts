import { Request, Response, NextFunction } from "express";
import { categorySchema } from "./validationSchema";
import { API_STATUS } from "../config/constants";

export const validationMiddleware = (op: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let schema;
    switch (op) {
      case "addCategory":
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
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: API_STATUS.ERROR,
        error: error.details.map((err) => err.message),
      });
    }
    next();
  };
};
