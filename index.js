const express = require('express');
const dotenv = require('dotenv');

// morgan is a logger middleware
const morgan = require('morgan');

// Route files
const bootcamps = require('./routes/bootcamps');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Create Express app
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Define port
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
});
