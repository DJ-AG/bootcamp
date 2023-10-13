const Course = require("../models/Course");
const Bootcamp = require("../models/Bootcamp");
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
  else
    query = Course.find().populate({
      path: "bootcamp", // Populating data from the related bootcamp
      select: "name description", // Selecting only name and description fields from the populated bootcamp data
    });

  // Executing the query and storing the result in the courses variable
  // If there’s an error in the awaited promise, it will be caught by the asyncHandler middleware
  const courses = await query;

  // Sending a success response to the client with the fetched courses
  // The response contains a status code of 200 and a JSON payload with a success flag, count of courses, and the courses data
  res.status(200).send({ success: true, count: courses.length, data: courses });
});

// Desc: Get single course
// @route GET /api/v1/courses/:id
// @access Public

exports.getCourseById = asyncHandler(async (req, res, next) => {
  // Finding the course by id and populating the related bootcamp data
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp", // Populating data from the related bootcamp
    select: "name description", // Selecting only name and description fields from the populated bootcamp data
  });

  // If no course is found, send a 404 response with an appropriate error message
  if (!course)
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );

  // Sending a success response to the client with the fetched course
  // The response contains a status code of 200 and a JSON payload with a success flag and the course data
  res.status(200).send({ success: true, data: course });
});

// Desc: Add course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is course owner
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

