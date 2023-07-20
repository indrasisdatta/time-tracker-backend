import { NextFunction, Request, Response } from "express";
import Category from "../models/Category";
import { API_STATUS } from "../config/constants";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ status: API_STATUS.SUCCESS, data: categories });
  } catch (error) {
    // next(error);
    res.status(500).json({ status: API_STATUS.ERROR, err: error });
  }
};

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.status(200).json({ status: API_STATUS.SUCCESS, data: 123 });
  } catch (e) {
    next(e);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (e) {
    next(e);
  }
};
