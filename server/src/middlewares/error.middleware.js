// src/middleware/error.middleware.js
// This file defines an error handling middleware function called errorMiddleware. 
// This function takes four parameters: err, req, res, and next. 
// It checks if the error object has a statusCode property, and if not, it defaults to 500 (Internal Server Error). 
// Then it sends a JSON response with the success property set to false and the message property set to the error message or a default message if the error message is not provided.
const errorMiddleware = (err, req, res, next) => {
  const isMulterError = err.name === "MulterError";
  const statusCode = err.statusCode || (isMulterError ? 400 : 500);
  const message =
    err.code === "LIMIT_FILE_SIZE"
      ? "File size must be less than 5MB"
      : err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],   // agar error object me errors property hai to usse include karo response me, warna empty array bhejo. ye errors property validation errors ke liye useful hoti hai, jisme multiple validation errors ho sakte hain.
  });
};

export default errorMiddleware;
