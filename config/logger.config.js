const winston = require('winston');

const enumrateErrorFormat = winston.format((info) => {
    if (info instanceof Error) {
      Object.assign(info, { message: info.stack });
    }
    return info;
  });

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    enumrateErrorFormat(),
    winston.format.colorize(),
    winston.format.json(),
    winston.format.splat(),
    winston.format.printf(({ level, message}) => {return `${level}: ${message}`})),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error']
    })
  ],
});

module.exports = logger;

