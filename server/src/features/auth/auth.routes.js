import { Router } from "express";
import {
  register,
  googleLogin,
  login,
  refreshAccessToken,
  logout,
} from "./auth.controller.js";
import {
  googleLoginValidation,
  registerValidation,
  loginValidation,
} from "./auth.validation.js";
import validate from "../../middlewares/validate.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});


// register routes with validation and controller functions. registerValidation/loginValidation se validation rules apply karo, validate middleware se validation errors handle karo, aur register/login controller functions se registration/login logic handle karo.
router.post("/register", registerValidation, validate, register);

// login routes with validation and controller functions. registerValidation/loginValidation se validation rules apply karo, validate middleware se validation errors handle karo, aur register/login controller functions se registration/login logic handle karo.
router.post("/login", loginValidation, validate, login);

// google login route. frontend se Google ID token receive karke backend me verify karo, fir app ke access/refresh tokens issue karo.
router.post("/google", googleLoginValidation, validate, googleLogin);

// refresh token route without validation, kyunki refresh token ke liye specific validation rules nahi hain. directly refreshAccessToken controller function ko call karo, jo refresh token logic handle karega.
router.post("/refresh-token", refreshAccessToken);

// logout route, jisme user ko logout karne ke liye access token verify karke refresh token database se clear karte hain.
router.post("/logout", verifyJWT, logout);

export default router;
