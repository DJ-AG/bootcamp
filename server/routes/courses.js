const express = require('express');
const {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courses');

// Initializing the express router.
// The {mergeParams: true} option allows the router to access parameters from parent routers.
const router = express.Router({mergeParams: true});

// Define the base routes for retrieving all courses and adding a new course.
// .get(getCourses) - Handles GET requests to retrieve all courses.
// .post(addCourse) - Handles POST requests to create a new course.
router.route('/').get(getCourses).post(addCourse);

// Define routes to manage specific courses by ID.
// ":id" is a dynamic parameter, representing the ID of a specific course.
// .get(getCourseById) - Handles GET requests to retrieve a specific course by ID.
// .delete(deleteCourse) - Handles DELETE requests to remove a specific course by ID.
// .put(updateCourse) - Handles PUT requests to update details of a specific course by ID.
router
    .route('/:id')
    .get(getCourseById)
    .delete(deleteCourse)
    .put(updateCourse);

// Export the router to be used in other parts of the application.
module.exports = router;