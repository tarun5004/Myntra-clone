import { body } from "express-validator";

export const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number"),

  body("category")
    .optional()
    .trim()
    .isString()
    .withMessage("Category must be a string"),

  body("description")
    .optional()
    .trim()
    .isString()
    .withMessage("Description must be a string"),
];