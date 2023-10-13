const express = require('express');
const {
  getBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsRadius,
  bootcampPhotoUpload
} = require('../controllers/bootcamps');

const { protect,authorize } = require('../middleware/auth');

// Import the Bootcamp model for query middleware
const Bootcamp = require('../models/Bootcamp');

// Import the middleware for advanced query results
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');

// Initialize the express router
const router = express.Router();

// Re-route into other resource routers
// Any requests to '/:bootcampId/courses' will be forwarded to the courseRouter
router.use('/:bootcampId/courses', courseRouter);

// Route for getting bootcamps in a specific radius based on a zipcode and distance.
// The route parameters ":zipcode" and ":distance" are dynamic and user-defined in the URL.
router.route('/radius/:zipcode/:distance').get(getBootcampsRadius);

// Define route to handle bootcamp photo uploads.
// ":id/photo" is a dynamic route that expects an ID parameter and handles photo upload via PUT request.
router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload);

// Define the routes for general bootcamp data retrieval and creation.
// Apply the advancedResults middleware for GET requests, enhancing query capabilities.
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)  // "courses" is populated in query
  .post(protect,authorize('publisher','admin'),createBootcamp);  // Route to create a new bootcamp


// Define the routes to get, update, and delete a specific bootcamp by its ID.
// ":id" is a dynamic parameter, allowing for various IDs to be input and passed to controller functions.
router
  .route('/:id')
  .get(getBootcampById)  // Route to get a bootcamp by ID
  .put(protect,authorize('publisher','admin'),updateBootcamp)   // Route to update a bootcamp by ID
  .delete(protect,authorize('publisher','admin'),deleteBootcamp);  // Route to delete a bootcamp by ID

// Export the router
module.exports = router;