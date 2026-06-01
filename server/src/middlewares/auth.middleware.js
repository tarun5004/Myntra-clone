import jwt from "jsonwebtoken";
import User from "../features/auth/auth.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import env from "../config/env.js";
// authentication middleware to verify JWT access token and attach user to request object
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    // authorization header me token aata hai, jiska format hota hai "Bearer <token>".
    // mean if authorization header exist karta hai to usme se token part ko extract karo, otherwise token undefined ho jayega.
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, env.JWT_ACCESS_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired access token");
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;
  next();
});


// Logic:

// Token cookie ya Authorization: Bearer token header se liya.
// Token missing hai to 401.
// Token invalid/expired hai to 401.
// Token ke id se user find kiya.
// User ko req.user me attach kar diya.