const express = require('express');

const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
    } = require('../controllers/courses');

// Include other resource routers

const router = express.Router({mergeParams: true});

router.route('/').get(getCourses)

module.exports = router;