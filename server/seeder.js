const config = require("./utils/config");
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const asyncHandler = require("./middleware/asyncErrorHandler");
const logger = require("./config/logger.config");

// Importing the Mongoose models for Bootcamps and Courses.
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

// Function to connect to MongoDB and manage data import/destruction.
const connectDB = async () => {


  // Establish a connection to MongoDB using mongoose and environment variable.
  const connect = await mongoose.connect(config.mongodb_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 200000,
  });

  // Log connection success to the database.
  logger.info(`MongoDB connected`.cyan.bold);

  // Read JSON data for bootcamps and courses from filesystem and parse it.
  const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
  );

  const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
  );

  const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
  );

  const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
  )


  // Function to import data into the database.
  const importData = asyncHandler(async () => {
    // Create new documents in MongoDB for each bootcamp and course in the parsed JSON data.
    await Bootcamp.create(bootcamps);
    console.log("Bootcamp Imported...".green.inverse)

     await Course.create(courses);
     console.log("Course Imported...".green.inverse)

      await User.create(users);
      console.log("User Imported...".green.inverse)

      await Review.create(reviews);
      console.log("Review Imported...".green.inverse)

    // Log success and exit process after data import.
    console.log("All data Imported...".green.inverse);
    process.exit();
  });

  // Function to delete all data from the database.
  const DestroyData = asyncHandler(async () => {
    // Delete all documents in the Bootcamp and Course collections.
    await Bootcamp.deleteMany();
    console.log("Bootcamp Data Destroyed...".red.inverse)

    await Course.deleteMany();
    console.log("Course Data Destroyed...".red.inverse)

    await User.deleteMany();
    console.log("User Data Destroyed...".red.inverse)

    await Review.deleteMany();
    console.log("Review Data Destroyed...".red.inverse)

    // Log success and exit process after data destruction.
    console.log("All data Destroyed...".red.inverse);
    process.exit();
  });

  // Check command line arguments to determine whether to import or destroy data.
  if (process.argv[2] === "-import") importData();
  else if (process.argv[2] === "-destroy") DestroyData();
};


connectDB();