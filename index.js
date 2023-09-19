const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./config/logger.config');
const colorse = require('colors');
const errorHandler = require('./middleware/error');

// morgan is a logger middleware
const morgan = require('morgan');

// Route files
const bootcamps = require('./routes/bootcamps');

// Load environment variables
connectDB()

// Create Express app
const app = express();

// Body parser
app.use(express.json());


// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Error handler middleware
app.use(errorHandler());


// Define port
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port.yellow.bold} in ${process.env.NODE_ENV.yellow.bold} mode`);
});
