import Joi from "joi";
import { Category } from "../models/Category";
import { logger } from "../utils/logger";
import { validateTimeSlots } from "../utils/helpers";
import { User } from "../models/User";

export const signupUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
    "string.empty": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required",
    "string.empty": "Last name is required",
  }),
  role: Joi.string().required().valid("admin", "end_user").messages({
    "any.required": "Role is required",
    "string.empty": "Role is required",
  }),
  email: Joi.string()
    .required()
    .email()
    .external(async (email, helpers) => {
      logger.info(`Email Context:`, helpers.prefs.context);
      let findCondition: any = { email };
      const isExisting = await User.findOne({ email });
      if (isExisting) {
        throw new Error("Email already exists");
      }
      return email;
    })
    .messages({
      "any.required": "Email is required",
      "string.empty": "Email is required",
      "string.email": "Email format is invalid",
    }),
  password: Joi.string().required().label("Password").messages({
    "any.required": "Password is required",
    "string.empty": "Password is required",
  }),
  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .messages({
      "any.required": "Confirm Password is required",
      "string.empty": "Confirm Password is required",
      "any.only": "Password and Confirm Password fields don't match",
    }),
});

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
        name: Joi.string()
          .required()
          .external(async (name, helpers) => {
            logger.info(`Context:`, helpers.prefs.context);
            /* {"subCategories.name": "FT"},
            {"subCategories": {"$elemMatch": {name: "FT""} }} */
            let findCondition: any = {
              "subCategories.name": name,
            };
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
              throw new Error("Sub-category name already exists");
              // return helpers.error("Category name already exists");
            }
            return name;
          })
          .messages({
            "any.required": "Sub-category name is required",
            "string.empty": "Sub-category name is required",
          }),
        isProductive: Joi.boolean().optional().allow(null, ""),
        description: Joi.string().optional().allow(null, ""),
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
        isProductive: Joi.boolean().optional().allow(null, ""),
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

export const reportSearchSchema = Joi.object({
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
  category: Joi.any().optional().allow(null, ""),
  subCategory: Joi.any().optional().allow(null, ""),
  sortBy: Joi.any().optional().allow(null, ""),
});
