import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.controller.js";
import { createProductValidation, updateProductValidation } from "./product.validation.js";
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


router.get("/", getAllProducts); // GET request ke liye route define karo, jo getAllProducts controller function ko call karega, taaki saare products ko client ko return kar sako.

// getProductBYID routes
router.get("/:id", getProductById); // GET request ke liye route define karo, jisme product ID ko route parameter ke roop me accept karo, aur getProductById controller function ko call karo, taaki specific product ki details ko client ko return kar sako.

// update product route
router.put(
  "/:id",
  verifyJWT,                      // JWT authentication middleware, taaki sirf authenticated users hi product update kar saken.
  upload.array("images", 5),      // Multer middleware for handling multiple file uploads. "images" field se max 5 files accept karo, taaki users ek saath bahut zyada images upload na kar saken.
  updateProductValidation,        // Validation middleware, jo incoming request body ko validate karega against the defined schema in product.validation.js. agar validation fail hota hai to error response bhejega, warna aage badhne dega.
  validate,                       // Validation result ko check karne wala middleware, jo validation errors ko handle karega aur agar errors hain to appropriate error response bhejega.
  updateProduct
);


// delete product route
router.delete(
  "/:id",
  verifyJWT,
  deleteProduct
);




export default router;
