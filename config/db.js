require("dotenv").config();
const colorse = require("colors");
const logger = require("./logger.config");

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB connected`.cyan.bold);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;