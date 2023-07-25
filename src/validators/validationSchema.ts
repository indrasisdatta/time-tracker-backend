import Joi from "joi";
import { Category } from "../models/Category";
import { logger } from "../utils/logger";

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
  // .messages({
  //   "any.required": "Sub-category is required", // name is not passed at all
  //   "string.empty": "Sub-category is required", // name is passed as blank
  // }),
});
