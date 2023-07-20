import Joi from "joi";

export const categorySchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Category name is required", // name is not passed at all
    "string.empty": "Category name is required", // name is passed as blank
  }),
  description: Joi.string().optional(),
  subCategory: Joi.array()
    .min(1)
    .items(
      Joi.object({
        name: Joi.string().required().messages({
          "any.required": "Sub-category name is required",
          "string.empty": "Sub-category name is required",
        }),
        description: Joi.string().optional(),
      })
    )
    .required()
    .messages({
      "any.required": "Sub-category is required", // name is not passed at all
      "string.empty": "Sub-category is required", // name is passed as blank
    }),
});
