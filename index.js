const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./config/logger.config');
const colors = require('colors');
const errorHandler = require('./middleware/error');

const morgan = require('morgan'); // HTTP request logger middleware

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');

// Load environment variables
// Note: it seems like dotenv is required but not used. 
// Normally, we would load the environment variables with dotenv.config().
connectDB();

// Create an instance of an Express app
const app = express();

// Body parser
// Middleware to parse JSON bodies from HTTP requests
app.use(express.json());

// Development logging middleware
// Utilizing morgan to log HTTP requests in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Mount routers
// These routers define routes that our application will respond to.
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

// Error handler middleware
// Utilize custom error handler middleware to centrally manage error responses.
app.use(errorHandler);

// Define port
// Set the port that the Express server will listen on.
const port = process.env.PORT || 5000;

// Start the Express server
// Initiate listening on the defined port and log the status.
app.listen(port, () => {
  logger.info(`Server running on port ${port.toString().yellow.bold} in ${process.env.NODE_ENV.yellow.bold} mode`);
});