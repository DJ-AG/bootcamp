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
  let query;

  // Check if a bootcamp ID is provided in the request URL.
  // If provided, the response will only include courses related to this bootcamp.
  if (req.params.bootcampId) {
    // Find all courses related to the specified bootcamp ID.
    query = Course.find({ bootcamp: req.params.bootcampId });
  }
  // If no bootcamp ID is provided, fetch all courses along with their related bootcamp details.
  else
    query = Course.find().populate({
      path: "bootcamp", 
      select: "name description",
    });

  // Execute the query and store the retrieved courses in a variable.
  const courses = await query;

  // Send response to client: 
  // Status: 200 OK
  // Body: JSON containing: 
  // - success: true
  // - count: Number of courses retrieved
  // - data: Array of courses
  res.status(200).send({ success: true, count: courses.length, data: courses });
});

// Desc: Get single course
// @route GET /api/v1/courses/:id
// @access Public

exports.getCourseById = asyncHandler(async (req, res, next) => {
  // Find a course with the provided ID and populate the related bootcamp’s name and description.
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  // If no course is found, send an error response.
  if (!course)
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );

  // Send response with found course data.
  res.status(200).send({ success: true, data: course });
});

// Desc: Add course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  // Assign the bootcamp ID and user ID from the request to the body object.
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  // Check if the bootcamp exists.
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  // Check if the user is the owner of the bootcamp or an admin.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  // Create a new course using the request body data.
  const course = await Course.create(req.body);

  // Send response with created course data.
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

  // If the course is not found, send an error response.
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  // Check if the user is the owner of the course or an admin.
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        401
      )
    );
  }

  // Update the course with the provided data.
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Send response with updated course data.
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

  // If the course is not found, send an error response.
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  // Check if the user is the owner of the course or an admin.
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    );
  }

  // Delete the course.
  await course.remove();

  // Send response with success status and empty data object.
  res.status(200).json({
    success: true,
    data: {}
  });
});

