import { Router } from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout,
} from "./auth.controller.js";
import {
  registerValidation,
  loginValidation,
} from "./auth.validation.js";
import validate from "../../middlewares/validate.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// register routes with validation and controller functions. registerValidation/loginValidation se validation rules apply karo, validate middleware se validation errors handle karo, aur register/login controller functions se registration/login logic handle karo.
router.post("/register", registerValidation, validate, register);

// login routes with validation and controller functions. registerValidation/loginValidation se validation rules apply karo, validate middleware se validation errors handle karo, aur register/login controller functions se registration/login logic handle karo.
router.post("/login", loginValidation, validate, login);

// refresh token route without validation, kyunki refresh token ke liye specific validation rules nahi hain. directly refreshAccessToken controller function ko call karo, jo refresh token logic handle karega.
router.post("/refresh-token", refreshAccessToken);

// logout route, jisme user ko logout karne ke liye controller function call karo. is route par authentication middleware apply karna optional hai, kyunki logout logic me user ID ki zarurat hoti hai, jo access token se mil sakti hai, lekin agar access token expire ho gaya hai to bhi refresh token ke through logout karna chahiye, isliye authentication middleware ko skip karna better hoga.
router.post("/logout",verifyJWT, logout);

export default router;