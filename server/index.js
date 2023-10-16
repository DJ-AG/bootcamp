const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const config = require("./utils/config");
const connectDB = require("./config/db");
const logger = require("./config/logger.config");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const mongoSanitize = require("express-mongo-sanitize"); // Sanitize user-supplied data to prevent MongoDB Operator Injection
const helmet = require("helmet"); // Helmet helps you secure your Express apps by setting various HTTP headers
const xss = require("xss-clean"); // Sanitize user-supplied data to prevent XSS attacks
const rateLimit = require('express-rate-limit'); // Rate limiting middleware to limit repeated requests to public APIs and/or endpoints such as password reset.
const hpp = require("hpp"); // Express middleware to protect against HTTP Parameter Pollution attacks
const cors = require("cors"); // Enable CORS
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const morgan = require("morgan"); // HTTP request logger middleware

// Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Load environment variables
// Note: it seems like dotenv is required but not used.
// Normally, we would load the environment variables with dotenv.config().
connectDB();

// Create an instance of an Express app
const app = express();

// Cookie parser
app.use(cookieParser());


// Body parser
// Middleware to parse JSON bodies from HTTP requests
app.use(express.json());

// Development logging middleware
// Utilizing morgan to log HTTP requests in development mode
if (config.node_env === "development") app.use(morgan("dev"));

app.use(fileupload());

// Sanitize user-supplied data to prevent MongoDB Operator Injection
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // 100 requests per windowMs
});

app.use(limit);

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());

// Enable CORS
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('../client/dist'));

// Mount routers
// These routers define routes that our application will respond to.
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use('/api/v1/auth',auth)
app.use('/api/v1/users',users)
app.use('/api/v1/reviews',reviews)

// Error handler middleware
// Utilize custom error handler middleware to centrally manage error responses.
app.use(errorHandler);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// Define port
// Set the port that the Express server will listen on.
const port = config.port;

// Start the Express server
// Initiate listening on the defined port and log the status.
app.listen(port, () => {
  logger.info(
    `Server running on port ${port.toString().yellow.bold} in ${
      config.node_env.yellow.bold
    } mode`
  );
});
