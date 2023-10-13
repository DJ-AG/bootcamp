const path = require("path");
const config = require("../utils/config");
const logger = require("../config/logger.config");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/asyncErrorHandler");
const ErrorResponse = require("../utils/errorResponse");
const colors = require("colors");

// Desc: Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // Sending a response with the fetched bootcamps and pagination info
  res.status(200).json(res.advancedResults);
});
// Desc: Get single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcampById = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  // If no bootcamp is found, send a 404 response with an appropriate error message
  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: bootcamp });
});

// Desc: Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  
  // Check for published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({user: req.user.id})
  
  // If the user is not an admin, they can only add one bootcamp
  if(publishedBootcamp && req.user.role !== "admin"){
    return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400))
  }

  const bootcamp = await Bootcamp.create(req.body);
  

  res.status(201).json({ success: true, data: bootcamp });
});

// Desc: Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  res.status(200).json({ success: true, data: bootcamp });
});

// Desc: Delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  bootcamp.deleteOne({ _id: req.params.id }); //triggers middleware pre('deleteOne')

  res
    .status(200)
    .json({
      succes: true,
      data: `Bootcamp with id ${req.params.id} has been deleted`,
    });
});

// Desc: Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Using a geocoder to convert a postal code into latitude and longitude
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculating radius in radians and fetching bootcamps in the given radius
  const radius = distance / 6378; // using km

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// Desc: Upload foto for BootCamp
// @route DELETE /api/v1/bootcamps/:id/photo
// @access Private
// Upload photo for BootCamp
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  // Check if bootcamp exists
  if (!bootcamp)
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );

  // Check if file is uploaded
  if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));

  console.log(req.files);

  const file = req.files.file;
  // Check if uploaded file is an image
  if (!file.mimetype.startsWith("image"))
    return next(new ErrorResponse(`Please upload an image file`, 400));

  // Check file size
  if (file.size > config.max_file_upload) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${config.max_file_upload}`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Move the uploaded file to the designated upload path and update the bootcamp's photo field in the database
  file.mv(`${config.file_upload_path}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    // Sending a response back to the client with the name of the uploaded file
    res.status(200).json({ succes: true, data: file.name });
  });
  console.log(file.name);
});
