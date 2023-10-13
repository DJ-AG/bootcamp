const ErrorResponse = require('../utils/errorResponse');


// Defining a general purpose error handling middleware for Express.
const errorHandler = (err, req, res, next) => {
  // Creating a copy of the error object that’s passed in.
  let error = { ...err };

  // Explicitly setting the error message on our new error object.
  error.message = err.message;

  // Logging the original error object for debugging purposes.
  console.log(err);

  // Handling specific error types:

  // Handling Mongoose bad ObjectId error (invalid format of ObjectId used in a query).
  if (err.name === 'CastError') {
    // Creating a user-friendly error message.
    const message = `Resource not found`;
    // Creating a new ErrorResponse object with a 404 status code.
    error = new ErrorResponse(message, 404);
  }

  // Handling Mongoose duplicate key error (e.g., trying to create a new resource with a duplicate unique field).
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Handling Mongoose validation error (failure to meet schema type requirements).
  if (err.name === 'ValidationError') {
    // Aggregating all the Mongoose error messages into an array.
    const message = Object.values(err.errors).map(val => val.message);
    // Using a 400 status code for client-side input errors.
    error = new ErrorResponse(message, 400);
  }

  // Sending a response to the client that includes the error status code and message.
  // If no specific status code is available, default to a 500 status code (Internal Server Error).
  // If no specific message is available, default to 'Server Error'.
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
