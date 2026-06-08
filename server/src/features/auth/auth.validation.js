import { body } from "express-validator";  // express-validator se body function import karo, taaki request body ke fields par validation rules define kar sako.


// registerValidation aur loginValidation arrays define karo, jisme express-validator ke body function ka use karke validation rules define honge.
export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const googleLoginValidation = [
  body("idToken")
    .notEmpty()
    .withMessage("Google ID token is required")
    .isString()
    .withMessage("Google ID token must be a string"),
];
