import mongoose from "mongoose";
import Product from "./product.model.js";
import imagekit from "../../config/imagekit.js";
import ApiError from "../../utils/ApiError.js";




// uploadImagesToImageKit helper function define karo, jo uploaded images ko ImageKit pe upload karega aur unke URLs return karega. is function ko product controller me use karenge jab product create ya update karenge.
const uploadImagesToImageKit = async (files = []) => {
    if (files.length === 0) return [];

    const uploadPromises = files.map((file) => {
        return imagekit.upload({
            file: file.buffer, // multer ke memoryStorage me uploaded file ka buffer use karo, taaki usse ImageKit pe upload kar sako.
            fileName: `${Date.now()}-${file.originalname}`, // unique file name generate karo using current timestamp aur original file name, taaki ImageKit pe file name conflicts na ho.
            folder: "/products", // images ko ImageKit ke "products" folder me upload karo, taaki saari product images ek jagah organized rahe.
        });
    })

    const uploadedImages = await Promise.all(uploadPromises); // saare upload promises ko resolve karo using Promise.all, taaki jab tak saari images upload na ho jayein tab tak aage na badhein.

    return uploadedImages.map((img) => img.url); // upload hone ke baad, uploaded images ke URLs return karo, taaki unhe product document me save kar sako.
}
// Promise = "Result abhi nahi mila, future me milega"
// Promise.all = "Sabka result aane ka wait karo"



// validate productid helper function to check if the provided product ID is a valid MongoDB ObjectId. agar valid nahi hai to ApiError throw karo, taaki error handling middleware usse handle kar sake.
const validateProductId = (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new ApiError(400, "Invalid product ID"); // agar productId valid ObjectId nahi hai, to 400 Bad Request error throw karo with message "Invalid product ID", taaki client ko pata chale ki unhone galat ID provide ki hai.
    }
};




// createProduct service function define karo, jo product creation logic handle karega. is function me product details aur uploaded images ko process karke new product create karenge.
// step 1: function ko async banayo, taaki isme asynchronous operations (jaise image upload) handle kar sako.
// accept karo ek object jisme body (product details), files (uploaded images), aur userId (product creator ka ID) ho. ye parameters controller se pass honge jab product create route hit hoga.

export const createProductService  = async ({body, files, userId}) => {
    
    // step 2: uploaded images ko ImageKit pe upload karo using the uploadImagesToImageKit helper function, aur unke URLs ko ek variable me store karo.
    const imageUrls = await uploadImagesToImageKit(files); // uploaded images ko ImageKit pe upload karo using the helper function, aur unke URLs ko imageUrls variable me store karo.

    // step 3: product details (body) me images ke URLs aur createdBy field (userId) add karo, taaki ye information product document me save ho jaye.
    const product = await Product.create({
    name: body.name,
    description: body.description,
    price: body.price,
    category: body.category,
    images: imageUrls,
    createdBy: userId,
    });

    return product;                              
}


// >> getallProducts service function define karo, jo saare products ko database se fetch karega aur return karega. is function me pagination aur filtering logic bhi add karenge taaki large number of products ko efficiently handle kar sako.
export const getAllProductsService = async (query) => {
    const filter = {};                                // filter object initialize karo, jisme query parameters ke basis pe filtering criteria set karenge.

    if (query.category) {
        filter.category = query.category;              // agar query me category parameter hai, to filter object me category field set karo, taaki products ko specified category ke basis pe filter kar sako.
    }

    // when user not category then return all products
    const products = await Product.find(filter).sort({ createdAt: -1 }); // filter criteria ke basis pe products ko database se fetch karo using Product.find(filter), aur unhe createdAt field ke descending order me sort karo, taaki latest products pehle aayein.

    return products;                                 // filtered aur sorted products ko return karo, taaki controller me unhe client ko response me bhej sako.
}




// >> getProductBy id service 
export const getProductByIdService = async (productId) => {
    validateProductId(productId); // productId ko validate karo using the validateProductId helper function, taaki ensure kar sako ki provided ID valid hai aur database query me use karne se pehle error throw ho jaye agar ID invalid hai.

    const product = await Product.findById(productId); // database se product ko uske ID ke basis pe fetch karo using Product.findById(productId), taaki specific product ki details mil sake.

    if (!product) {
        throw new ApiError(404, "Product not found"); // agar product database me nahi milta hai, to 404 Not Found error throw karo with message "Product not found", taaki client ko pata chale ki requested product exist nahi karta.
    }
    return product;
}


// >> updateProduct Service

export const UpdateProductService = async (productId, body, files) => {
    console.log("Product ID:", productId);
    console.log("type of Product ID:", typeof productId);
    validateProductId(productId); // productId ko validate karo using the validateProductId helper function, taaki ensure kar sako ki provided ID valid hai aur database query me use karne se pehle error throw ho jaye agar ID invalid hai.

    const product = await Product.findById(productId); // database se product ko uske ID ke basis pe fetch karo using Product.findById(productId), taaki specific product ki details mil sake.

    if (!product) {
        throw new ApiError(404, "Product not found"); // agar product database me nahi milta hai, to 404 Not Found error throw karo with message "Product not found", taaki client ko pata chale ki requested product exist nahi karta.
    }

    const updateData = {}

  if (body.name !== undefined) updateData.name = body.name;
  if (body.description !== undefined) updateData.description = body.description;
  if (body.price !== undefined) updateData.price = body.price;
  if (body.category !== undefined) updateData.category = body.category;


  if (files && files.length > 0) {
    const imageUrls = await uploadImagesToImageKit(files); // uploaded images ko ImageKit pe upload karo using the helper function, aur unke URLs ko imageUrls variable me store karo.
    updateData.images = imageUrls; // agar new images upload ki gayi hain, to unke URLs ko updateData object me set karo, taaki product document me updated images save ho jayein.
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
        new: true, // updated document ko return karo, taaki controller me usse client ko response me bhej sako.
        runValidators: true, // updateData ke against validation rules ko run karo, taaki ensure kar sako ki updated data valid hai.
    }
  );
  return updatedProduct;
};