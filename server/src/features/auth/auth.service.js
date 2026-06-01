import jwt from "jsonwebtoken";
import User from "./auth.model.js";
import ApiError from "../../utils/ApiError.js";
import env from "../../config/env.js";


// genrate access and refresh token
export const generateAccessAndRefreshTokens = async (userID) => {
    const user = await User.findById(userID).select("+refreshToken");  // refresh token bhi chahiye hume, taaki access/refresh token dono generate kar sake.

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    // refresh token ko user document me save karo, taaki future me refresh token verify kar sako.
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });  // validation skip karo kyunki hum sirf refresh token update kar rahe hai, aur baki fields me koi change nahi kar rahe.

    return { accessToken, refreshToken };
}

// register user
export const registerUser = async ({ name, email, password }) => {
    // check if user with the given email already exists
    const existingUser = await user.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    // create new user
  const user = await User.create({
    name,
    email,
    password,
    authProvider: "local", // local means email/password se register hua user hai, future me google/facebook se register hone wale users ke liye alag authProvider value use kar sakte hai.
  });

    // generate access and refresh tokens for the new user
    const tokens = await generateAccessAndRefreshTokens(user._id);
// access/refresh token generate karne ke baad user document update hoga kyunki refresh token save karna hai, isliye latest user document fetch karo taaki updated refresh token value mile.
    const createdUser = await User.findById(user._id);

    return {
        user: createdUser,
        ...tokens,
    };
};