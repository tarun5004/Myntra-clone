import dotenv from "dotenv";

dotenv.config();


// required environment variables ki list banao,
//  jisme wo variables include hon jo application ke sahi tarike se chalne ke liye zaruri hain.
const requiredEnvVars = [
  "MONGO_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

// check karo ki required environment variables set hai ya nahi. 
// agar koi required variable missing hai to error throw karo.
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",

  MONGO_URL: process.env.MONGO_URL,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
};

export default env;

// dotenv se environment variables load karo, fir check karo ki required environment variables 
// set hai ya nahi. agar koi required variable missing hai to error throw karo.
//  finally env object export karo jisme saare environment variables available honge.