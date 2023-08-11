import Joi from "joi";
import { Category } from "../models/Category";
import { logger } from "../utils/logger";
import { validateTimeSlots } from "../utils/helpers";

export const categorySchema = Joi.object({
  name: Joi.string()
    .required()
    .external(async (name, helpers) => {
      logger.info(`Context:`, helpers.prefs.context);
      // const isUnique = await Category.isCategoryNameUnique(value);
      let findCondition: any = { name };
      if (
        typeof helpers.prefs.context !== "undefined" &&
        helpers.prefs.context.req?.params?.catId
      ) {
        findCondition = {
          ...findCondition,
          _id: { $ne: helpers.prefs.context.req?.params?.catId },
        };
      }
      const isExisting = await Category.findOne(findCondition);
      if (isExisting) {
        throw new Error("Category name already exists");
        // return helpers.error("Category name already exists");
      }
      return name;
    })
    .messages({
      "any.required": "Category name is required", // name is not passed at all
      "string.empty": "Category name is required", // name is passed as blank
    }),
  description: Joi.string().optional().allow(null, ""),
  subCategories: Joi.array()
    .min(1)
    .items(
      Joi.object({
        _id: Joi.string().optional(),
        name: Joi.string().required().messages({
          "any.required": "Sub-category name is required",
          "string.empty": "Sub-category name is required",
        }),
        description: Joi.string().optional(),
      })
    )
    .required(),
});

export const timesheetSchema = Joi.object({
  timesheetDate: Joi.string().required().messages({
    "any.required": "Date is required", // not passed at all
    "string.empty": "Date is required", // passed as blank
  }),
  timeslots: Joi.array()
    .min(1)
    .items(
      Joi.object({
        startTime: Joi.string().required().messages({
          "any.required": "Start time is required",
          "string.empty": "Start time is required",
        }),
        endTime: Joi.string().required().messages({
          "any.required": "End time is required",
          "string.empty": "End time is required",
        }),
        category: Joi.string().required().messages({
          "any.required": "Category is required",
          "string.empty": "Category is required",
        }),
        subCategory: Joi.string().required().messages({
          "any.required": "Sub-category is required",
          "string.empty": "Sub-category is required",
        }),
        comments: Joi.string().allow(null, "").optional(),
      })
    )
    .required()
    .custom((value, helper) => {
      const timeslotErr: any = validateTimeSlots(value);
      if (timeslotErr) {
        return helper.message(timeslotErr);
      }
      return value;
    }),
});

export const timesheetSummarySchema = Joi.object({
  startDate: Joi.date().required().messages({
    "any.required": "Enter Start date in YYYY-MM-DD format",
    "date.empty": "Enter Start date in YYYY-MM-DD format",
    "date.base": "Enter Start date in YYYY-MM-DD format",
  }),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).required().messages({
    "any.required": "Enter End date in YYYY-MM-DD format",
    "date.empty": "Enter End date in YYYY-MM-DD format",
    "date.min": "End date cannot be less than start date",
    "date.format": "Enter End date in YYYY-MM-DD format",
  }),
});
