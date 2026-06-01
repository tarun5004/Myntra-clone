// src/middleware/error.middleware.js
// This file defines an error handling middleware function called errorMiddleware. 
// This function takes four parameters: err, req, res, and next. 
// It checks if the error object has a statusCode property, and if not, it defaults to 500 (Internal Server Error). 
// Then it sends a JSON response with the success property set to false and the message property set to the error message or a default message if the error message is not provided.
const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

export default errorMiddleware;