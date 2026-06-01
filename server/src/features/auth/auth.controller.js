import asyncHandler from "../../utils/asyncHandler.js";
import { registerUser } from "./auth.service.js";
import env from "../../config/env.js";

// cookie options for access and refresh tokens
const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
};




// controller function for user registration
export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body); // registerUser service function ko call karo, jo user registration logic handle karega, aur result me registered user data ke sath access/refresh tokens milega.

  res
    .status(201)
    .cookie("accessToken", result.accessToken, cookieOptions)
    .cookie("refreshToken", result.refreshToken, cookieOptions)
    .json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
});


// controller function for user login
export const login = asynchandler(async (req, res) => {
    const result = await loginUser(req.body); // loginUser service function ko call karo, jo user login logic handle karega, aur result me logged in user data ke sath access/refresh tokens milega.

    res
    .status(200)
    .cookie("accessToken", result.accessToken, cookieOptions) // access token ko cookie me set karo, taaki client side par login state manage kar sako.
    .cookie("refreshToken", result.refreshToken, cookieOptions)// refresh token ko cookie me set karo, taaki client side par refresh token ke through access token refresh kar sako.
    .json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
});