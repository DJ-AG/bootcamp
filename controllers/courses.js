const Course = require("../models/Course");
const asyncHandler = require("../middleware/asyncErrorHandler");
const ErrorResponse = require("../utils/errorResponse");

// Desc: Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } 
  
  else  query = Course.find();
  

  const courses = await query;

  res.status(200).send({success: true,count: courses.length,data: courses});
});
