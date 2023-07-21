import { NextFunction, Request, Response } from "express";
import Category, { ISubCategory } from "../models/Category";
import { API_STATUS } from "../config/constants";
import mongoose, { Types, mongo } from "mongoose";

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
    const { name, description, subCategories: subCat } = req.body;
    const newCat = new Category({
      name,
      description,
      subCategories: subCat.map((subCat: ISubCategory) => ({
        _id: new mongoose.Types.ObjectId(),
        name: subCat.name,
        description: subCat.description,
      })),
    });
    const cat = await newCat.save();
    if (cat) {
      return res.status(200).json({ status: API_STATUS.SUCCESS, data: cat });
    }
    res.status(500).json({ status: API_STATUS.ERROR, data: [] });
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
      existingCat.subCategories = subCat.map((newSubCat: ISubCategory) => {
        let existingSubCat = existingCat.subCategories?.find(
          (oldSubCat) => oldSubCat._id === newSubCat._id
        );
        /* If id is passed and subcategory already exists, then edit it */
        if (existingSubCat) {
          // existingSubCat._id = new Types.ObjectId(existingSubCat._id);
          existingSubCat.name = newSubCat.name;
          existingSubCat.description = newSubCat.description;
          return existingSubCat;
        }
        newSubCat._id = new mongoose.Types.ObjectId();
        /* Add subcategory */
        return newSubCat;
      });
    }

    const cat = await existingCat.save();
    if (cat) {
      return res.status(200).json({ status: API_STATUS.SUCCESS, data: cat });
    }
    res.status(500).json({ status: API_STATUS.ERROR, data: [] });
  } catch (e) {
    next(e);
  }
};

/**
 * TODO:
 * Add, edit testing
 * 1. Edit - even if existing subcat with _id is sent, it still creates new _id
 *
 * 2. Add, Edit - For both category and subcategory -
 * If description is sent "" - it gives validation error.
 * Works if no description is passed
 *
 * In sub cat, if _id is not supplied, add it
 */
