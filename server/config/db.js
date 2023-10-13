require("dotenv").config();
const colors = require("colors");
const logger = require("./logger.config");

const mongoose = require("mongoose");

// Define an asynchronous function that will try to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to establish a connection to MongoDB using the connection string provided in the .env file.
    // Options are provided to ensure that the connection uses the new URL string parser and the unified topology engine to avoid deprecation warnings.
    const connect = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log a successful connection message in cyan bold color.
    logger.info(`MongoDB connected`.cyan.bold);
  } catch (err) {
    // If an error occurs during connection, log the error message.
    logger.error(err);

    // Exit the application with a failure status (1).
    process.exit(1);
  }
};


module.exports = connectDB;