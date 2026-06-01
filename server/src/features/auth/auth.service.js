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
    const existingUser = await User.findOne({ email });

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



// login user

export const loginUser = async ({ email, password }) => {
    // email ke basis par user find karo, aur password/refreshToken field bhi select karo taaki login logic me use kar sako.
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.password) {
    throw new ApiError(400, "Please login with Google");
  }
// compare password method ko call karo, jo user document ke instance method me defined hai, aur password compare karo. ye method bcrypt.compare ka use karke plain text password ko hashed password se compare karega, aur true/false return karega.
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const tokens = await generateAccessAndRefreshTokens(user._id);
// access/refresh token generate karne ke baad user document update hoga kyunki refresh token save karna hai, isliye latest user document fetch karo taaki updated refresh token value mile.
  const loggedInUser = await User.findById(user._id);
// login successful hone ke baad user data ke sath access/refresh tokens return karo, taaki client side par login state manage kar sako.
  return {
    user: loggedInUser,
    ...tokens,
  };
};

// refresh access token using refresh token

// refresh token ke basis par access token refresh karne ke liye service function define karo, jisme incoming refresh token ko parameter ke roop me lo, aur usko verify karke naya access token generate karo.
export const refreshAccessTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
// incoming refresh token ko verify karo using jwt.verify, aur agar token valid hai to usme se user ID extract karo. agar token invalid ya expired hai to error throw karo.
  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      env.JWT_REFRESH_SECRET
    );
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }
// decoded token se user ID milne ke baad database me us user ko find karo, 
// aur refresh token bhi select karo taaki verify kar sako ki incoming refresh token 
// database me saved refresh token ke sath match karta hai ya nahi. agar user nahi milta ya 
// refresh token match nahi karta to error throw karo, taaki refresh token reuse/invalid hone
//  ki situation handle ho sake.
  const user = await User.findById(decodedToken.id).select("+refreshToken");

  if (!user) {
    throw new ApiError(401, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(401, "Refresh token is reused or invalid");
  }

  const tokens = await generateAccessAndRefreshTokens(user._id);

  return tokens;
};


// logout user by clearing refresh token from database

export const logoutUser = async (userID) => {
    // user ID ke basis par user find karo, aur refresh token field bhi select karo taaki usko clear kar sako.
    await User.findByIdAndUpdate(
        userID,
        {
            $set: {
                refreshToken: "", // database me saved refresh token ko clear karo, taaki logout hone ke baad refresh token reuse na ho sake.
            }
        },
        {
            new: true, // updated user document return karo
        }
    );
}