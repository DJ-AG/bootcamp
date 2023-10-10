const express = require('express');
const {
  getBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsRadius
} = require('../controllers/bootcamps');

const router = express.Router();
router.route('/radius/:zipcode/:distance').get(getBootcampsRadius)
router.route('/').get(getBootcamps).post(createBootcamp);
router
  .route('/:id')
  .get(getBootcampById)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
