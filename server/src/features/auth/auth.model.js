import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from '../../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: "",
    },
    // database me saved refresh token, taaki logout/refresh flow control ho sake
    refreshToken: {   
      type: String,
      default: "",
      select: false,  // by default password/refreshToken API response me nahi aayega
    },
  },
  { timestamps: true }
);

// hash the password before saving the user document

userSchema.pre("save", async function () {

    // password field modified hai ya nahi, aur password field exist karta hai ya nahi, dono check karo.
    // modified means ki ya to user naya hai aur password set kar raha hai, ya existing user apna password change kar raha hai.
    if (!this.isModified("password")|| !this.password) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
})


// instance method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// instance method to generate JWT token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            id: this._id,
            email: this.email,
            name: this.name,
        }, 
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.JWT_ACCESS_SECRET_EXPIRES_IN || "15m",
        }
    );
};

// instance method to generate refresh token
userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign (
        {
            id: this._id,
        },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.JWT_REFRESH_SECRET_EXPIRES_IN || "7d",
        }
    )
}


const User = mongoose.model("User", userSchema);

export default User;