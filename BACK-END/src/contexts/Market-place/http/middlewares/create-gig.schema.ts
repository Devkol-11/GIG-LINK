import Joi from "joi";

export const createGigSchema = Joi.object({
  title: Joi.string().min(5).max(100).required().messages({
    "string.empty": "Title is required.",
    "string.min": "Title must be at least 5 characters long.",
    "string.max": "Title must not exceed 100 characters.",
  }),

  description: Joi.string().min(20).max(2000).required().messages({
    "string.empty": "Description is required.",
    "string.min": "Description must be at least 20 characters long.",
    "string.max": "Description must not exceed 2000 characters.",
  }),

  category: Joi.string().required().messages({
    "string.empty": "Category is required.",
  }),

  tags: Joi.array().items(Joi.string().min(2).max(30)).max(10).messages({
    "array.max": "You can specify up to 10 tags.",
    "string.min": "Each tag must be at least 2 characters long.",
  }),

  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be greater than zero.",
    "any.required": "Price is required.",
  }),

  deadline: Joi.date().greater("now").optional().messages({
    "date.greater": "Deadline must be a future date.",
  }),
});
