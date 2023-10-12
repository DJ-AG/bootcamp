const express = require('express');

const {
    getCourses,
    getCourseById,
    addCourse,
    updateCourse,
    deleteCourse
    } = require('../controllers/courses');

// Include other resource routers

const router = express.Router({mergeParams: true});

router.route('/').get(getCourses).post(addCourse)

router
    .route('/:id')
    .get(getCourseById)
    .delete(deleteCourse)
    .put(updateCourse)



module.exports = router;