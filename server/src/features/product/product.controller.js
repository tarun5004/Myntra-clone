import asyncHandler from "../../utils/asyncHandler.js";
import { createProductService } from "./product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService({
    body: req.body,
    files: req.files,
    userId: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});