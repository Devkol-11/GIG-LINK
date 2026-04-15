import winston from "winston";

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // minimum log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // log to console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // log errors to file
    new winston.transports.File({ filename: "logs/combined.log" }), // log everything to file
  ],
});

export default logger;
