// This file defines a custom error class called ApiError that extends the built-in Error class. 
// It includes a constructor that takes a status code and a message as parameters, 
// and sets the statusCode and success properties accordingly. The success property is set to 
// false to indicate that the API request was not successful. This class can be used to create consistent error responses in an API.

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = []
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;