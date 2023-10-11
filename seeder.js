const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const asyncHandler = require("./middleware/asyncErrorHandler");
const logger = require("./config/logger.config");

dotenv.config({ path: "./.env" });

const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");

// Connect to DB

const connectDB = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 200000,
  });
  logger.info(`MongoDB connected`.cyan.bold);

  const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
  );
  const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
  );

  // Import data into DB
  // Import into DB
  const importData = asyncHandler(async () => {
    await Bootcamp.create(bootcamps);
    console.log("Bootcamp Imported...".green.inverse)

    await Course.create(courses);
    console.log("Course Imported...".green.inverse)

    console.log("All data Imported...".green.inverse);
    process.exit();
  });

  // Destroy data
  const DestroyData = asyncHandler(async () => {
    await Bootcamp.deleteMany();
    console.log("Bootcamp Data Destroyed...".red.inverse)

    await Course.deleteMany();
    console.log("Course Data Destroyed...".red.inverse)

    console.log("All data Destroyed...".red.inverse);
    process.exit();
  });

  if (process.argv[2] === "-import") importData();
  else if (process.argv[2] === "-destroy") DestroyData();
};

connectDB();