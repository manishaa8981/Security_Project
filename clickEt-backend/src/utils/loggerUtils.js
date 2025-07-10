// src/utils/loggerUtils.js
import winston from "winston";

// Determine the log level based on the environment
const logLevel = process.env.NODE_ENV === "production" ? "info" : "debug"; // `info` for production, `debug` for development

// Create the log format for the logger (structured JSON)
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(
    ({
      level,
      message,
      timestamp,
      requestType,
      endpoint,
      payload,
      responseTime,
      statusCode,
      error,
    }) => {
      return JSON.stringify(
        {
          timestamp,
          level,
          requestType,
          endpoint,
          payload,
          responseTime,
          statusCode,
          message,
          error: error || null,
        },
        null,
        2
      );
    }
  )
);

// Create the winston logger
const logger = winston.createLogger({
  level: logLevel, // Set the log level based on the environment
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    // Console transport for development or when in debugging mode
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    ...(process.env.NODE_ENV === "production"
      ? [new winston.transports.File({ filename: "logs/combined.log" })]
      : []), // No file logging in development (unless you specifically want it)
  ],
});

export { logger };
