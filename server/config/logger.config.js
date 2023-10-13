const winston = require('winston');

// Creating a custom Winston format that checks if logged information is an instance of Error
// If it is, it modifies the logged info to display the error stack trace.
const enumrateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

// Creating and configuring a Winston logger
const logger = winston.createLogger({
// Setting the logging level based on the node environment. 
// If in production, only log 'info' and above, otherwise 'debug' and above.
level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

// Defining the format of the logs
format: winston.format.combine(
  // Applying the custom error format defined earlier
  enumrateErrorFormat(),
  // Applying color to output in console
  winston.format.colorize(),
  // Outputting logs in JSON format
  winston.format.json(),
  // Enabling string interpolation
  winston.format.splat(),
  // Defining a printf format for displaying the log level and message
  winston.format.printf(({ level, message}) => {return `${level}: ${message}`})
),

// Defining the transport (i.e., where the logs are sent)
transports: [
  // Using console transport and directing 'error' level messages to stderr.
  new winston.transports.Console({
    stderrLevels: ['error']
  })
],
});

module.exports = logger;

