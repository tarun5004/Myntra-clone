import { Router } from "express";
import { createProduct } from "./product.controller.js";
import { createProductValidation } from "./product.validation.js";
import validate from "../../middlewares/validate.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.post(
  "/",
  verifyJWT,                      // JWT authentication middleware, taaki sirf authenticated users hi product create kar saken.
  upload.array("images", 5),      // Multer middleware for handling multiple file uploads. "images" field se max 5 files accept karo, taaki users ek saath bahut zyada images upload na kar saken.
  createProductValidation,        // Validation middleware, jo incoming request body ko validate karega against the defined schema in product.validation.js. agar validation fail hota hai to error response bhejega, warna aage badhne dega.
  validate,                       // Validation result ko check karne wala middleware, jo validation errors ko handle karega aur agar errors hain to appropriate error response bhejega.
  createProduct
);

export default router;