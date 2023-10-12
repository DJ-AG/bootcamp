const Course = require("../models/Course");
const asyncHandler = require("../middleware/asyncErrorHandler");
const ErrorResponse = require("../utils/errorResponse");

// Desc: Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public


// Creating an asynchronous function getCourses and exporting it
// It uses asyncHandler to avoid writing try/catch blocks in the function 
// and handle errors more gracefully

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query; // Initialize a variable to hold the Mongoose query object
  
  // Check if there is a bootcampId parameter in the request URL
  if (req.params.bootcampId) {
    // If bootcampId is present, set up a query to find all courses related to that bootcamp
    query = Course.find({ bootcamp: req.params.bootcampId });
  } 
  // If bootcampId is NOT present, set up a query to find all courses 
  // and populate the related bootcamp data
  else  query = Course.find().populate({
    path:'bootcamp', // Populating data from the related bootcamp
    select:'name description' // Selecting only name and description fields from the populated bootcamp data
  });

  // Executing the query and storing the result in the courses variable
  // If there’s an error in the awaited promise, it will be caught by the asyncHandler middleware
  const courses = await query;

  // Sending a success response to the client with the fetched courses
  // The response contains a status code of 200 and a JSON payload with a success flag, count of courses, and the courses data
  res.status(200).send({success: true,count: courses.length,data: courses});
});
