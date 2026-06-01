import multer from "multer";
import ApiError from "../utils/ApiError.js";

// Multer storage configuration for handling file uploads in memory.
const storage = multer.memoryStorage();  //step 1: multer ke storage ko memoryStorage pe set karo, taaki uploaded files memory me store ho jayein instead of disk pe.

// step 2: fileFilter function define karo, jo multer ko batata hai ki kaunse files accept karni hain aur kaunse reject karni hain. is case me hum sirf image files (jpeg, png, gif) accept kar rahe hain.
// and ye 3 parameters leta hai: req (request object), file (uploaded file object), aur cb (callback function). agar file valid hai to cb(null, true) call karo, warna cb(new ApiError("Invalid file type", 400), false) call karo.

const fileFilter = (req ,file, cb) => {
    if (file.mimetype.startsWith('image/')) {   // agar file ka mimetype 'image/' se start hota hai to usse accept karo
        cb(null, true);              // agar file valid hai to cb(null, true) call karo, taaki multer us file ko accept kar le.
    } else {
        cb(new ApiError("Invalid file type. Only image files are allowed.", 400), false);
    }
}

// Multer upload middleware create karo using the defined storage and fileFilter.
const upload = multer({
    storage, // multer ke storage ko memoryStorage pe set karo, taaki uploaded files memory me store ho jayein instead of disk pe.
    fileFilter,  // multer ke fileFilter ko set karo, taaki sirf valid image files hi accept ho.
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit set karo, taaki users bahut bade files upload na kar sakein.
    },
})
export default upload;

// step 3: multer upload middleware export karo, taaki ise routes me use kar sako. is middleware ko route me use karne se pehle, ensure karo ki ye route protected ho, taaki sirf authenticated users hi files upload kar sakein.