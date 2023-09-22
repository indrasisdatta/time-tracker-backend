import { NextFunction, Request, Response } from "express";
import { Category } from "../models/Category";
import { API_STATUS } from "../config/constants";
import mongoose, { ObjectId, Types, mongo } from "mongoose";
import { logger } from "../utils/logger";
import { ISubCategory } from "../types/Category";

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
    logger.info(`Category listing error: ${JSON.stringify(error)}`);
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingCat = await Category.findById(req.params.catId);
    if (!existingCat) {
      return res
        .status(400)
        .json({ status: API_STATUS.ERROR, error: ["Invalid category"] });
    }
    res.status(200).json({ status: API_STATUS.SUCCESS, data: existingCat });
  } catch (error) {
    // next(error);
    logger.info(`Category listing error: ${JSON.stringify(error)}`);
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, subCategories: subCat } = req.body;
    const newCat = new Category({
      name,
      description,
      subCategories: subCat.map((subCat: ISubCategory) => ({
        _id: new mongoose.Types.ObjectId(),
        name: subCat.name,
        isProductive: subCat.isProductive,
        description: subCat.description,
      })),
    });
    const cat = await newCat.save();
    if (cat) {
      return res.status(200).json({ status: API_STATUS.SUCCESS, data: cat });
    }
    res.status(500).json({ status: API_STATUS.ERROR, data: [] });
  } catch (error) {
    // next(error);
    logger.info(`Category add error: ${JSON.stringify(error)}`);
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingCat = await Category.findById(req.params.catId);
    if (!existingCat) {
      return res
        .status(400)
        .json({ status: API_STATUS.ERROR, error: ["Invalid category"] });
    }
    const { name, description, subCategories: subCat } = req.body;

    existingCat.name = name;
    existingCat.description = description;
    if (subCat && subCat.length > 0) {
      /* Loop through newly added sub categories */
      const tempSubCat = subCat.map((newSubCat: ISubCategory) => {
        let existingSubCat = existingCat.subCategories?.find(
          (oldSubCat) =>
            oldSubCat.id?.toString() === newSubCat._id ||
            oldSubCat._id?.toString() === newSubCat._id
        );
        /* If id is passed and subcategory already exists, then edit it */
        if (existingSubCat) {
          // existingSubCat._id = new Types.ObjectId(existingSubCat._id);
          existingSubCat.name = newSubCat.name;
          existingSubCat.isProductive = newSubCat.isProductive;
          existingSubCat.description = newSubCat.description;
          return existingSubCat;
        }
        newSubCat._id = new mongoose.Types.ObjectId() as unknown as ObjectId;
        /* Add subcategory */
        return newSubCat;
      });
      existingCat.subCategories = tempSubCat;
    }

    const cat = await existingCat.save();
    if (cat) {
      return res.status(200).json({ status: API_STATUS.SUCCESS, data: cat });
    }
    res.status(500).json({ status: API_STATUS.ERROR, data: [] });
  } catch (error) {
    // next(e);
    console.log(`Category Update Error:`, error);
    logger.info(`Category Update Error:`, error);
    res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.catId });
    return res.status(200).json({ status: API_STATUS.SUCCESS, data: category });
  } catch (error) {
    return res.status(500).json({ status: API_STATUS.ERROR, error });
  }
};
