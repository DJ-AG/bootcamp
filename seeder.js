const dotenv = require("dotenv");
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const asyncHandler = require("./middleware/asyncErrorHandler");
const logger = require("./config/logger.config");

dotenv.config({ path: "./.env" });

const Bootcamp = require("./models/Bootcamp");
// Connect to DB

const connectDB = async () => {
  
  const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
  );

  // Import into DB
  const importData = asyncHandler(async () => {
    await Bootcamp.create(bootcamps);
    console.log("Data Imported...".green.inverse);
    process.exit();
  });

  // Destroy data
  const DestroyData = asyncHandler(async () => {
    await Bootcamp.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  });
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 200000,
    });
    logger.info(`MongoDB connected`.cyan.bold);
    if (process.argv[2] === "-import") importData();
    else if (process.argv[2] === "-destroy") DestroyData();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

connectDB();
