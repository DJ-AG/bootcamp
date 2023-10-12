// Defining a higher-order function named 'asyncHandler' 
// It takes a function (fn) as an argument and returns another function that takes three arguments (req, res, next).
const asyncHandler = fn => (req, res, next) =>
  // It returns a promise that:
  // 1. Resolves with the result of calling the input function (fn) with the arguments (req, res, next)
  // 2. If an error occurs during the execution of the input function (fn), it catches that error and passes it to the next middleware in the Express middleware stack (using the next function).
  Promise.resolve(fn(req, res, next)).catch(next);

// Exporting asyncHandler to be utilized in other parts of the application, 
// which allows to handle asynchronous code inside Express.js route handlers and middleware in a clean and simple manner.
module.exports = asyncHandler;