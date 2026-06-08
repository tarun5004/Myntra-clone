import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  createProductService,
  deleteProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
} from "./product.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const product = await createProductService({
    body: req.body,
    files: req.files,
    userId: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});



// getAllProducts controller function define karo, jo getAllProductsService ko call karega aur saare products ko client ko return karega. is function me query parameters ko service function me pass karenge taaki filtering aur pagination implement kar sako.

export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await getAllProductsService(req.query); // query parameters ko service function me pass karo, taaki filtering aur pagination implement kar sako.

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});


// getProductById controller function define karo, jo getProductByIdService ko call karega aur specific product ki details ko client ko return karega. is function me product ID ko route parameters se extract karenge aur service function me pass karenge taaki product details fetch kar sako.

export const getProductById = asyncHandler (async (req, res) => {
  const product = await getProductByIdService(req.params.id); // route parameters se product ID ko extract karo aur service function me pass karo, taaki specific product ki details fetch kar sako.

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});


// updateProduct Controller
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await updateProductService({
    productId: req.params.id,
    body: req.body,
    files: req.files,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});


// deleteProduct Controller
export const deleteProduct = asyncHandler(async (req, res) => {
  await deleteProductService(req.params.id);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});
