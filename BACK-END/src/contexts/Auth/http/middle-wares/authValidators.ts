import Joi from "joi";

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
      "any.required": "Password is required.",
    }),

  phoneNumber: Joi.string()
    .pattern(/^(?:\+234|0)[789][01]\d{8}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Nigerian number (e.g. +2348012345678 or 08012345678).",
      "any.required": "Phone number is required.",
    }),

  firstName: Joi.string().min(2).max(50).required().messages({
    "string.min": "First name must be at least 2 characters long.",
    "any.required": "First name is required.",
  }),

  lastName: Joi.string().min(2).max(50).required().messages({
    "string.min": "Last name must be at least 2 characters long.",
    "any.required": "Last name is required.",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Email must be valid.",
      "any.required": "Email is required.",
    }),

  password: Joi.string().required().messages({
    "any.required": "Password is required.",
  }),
});
