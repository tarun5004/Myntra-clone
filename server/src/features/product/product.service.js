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