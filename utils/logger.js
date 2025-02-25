const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
require('winston-daily-rotate-file');

// Define the log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: 'logs/rma-quality-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m', // Maximum file size
      maxFiles: '14d' // Maximum number of days to retain logs
    }),
    new transports.Console()
  ]
});

module.exports = logger;
