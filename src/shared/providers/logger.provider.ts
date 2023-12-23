import { Provider } from "@nestjs/common";
var winston = require("winston");
winston.transports.DailyRotateFile = require("winston-daily-rotate-file");

export const loggerProvider: Provider = {
  provide: "Logger",
  useFactory: () => {
    return winston.createLogger({
      level: "info", // Set the default logging level
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          level: "info", // Set the level for this transport
          filename: "logs/application-%DATE%.log",
          datePattern: "YYYY-MM-DD", // Create new log files daily
          zippedArchive: false,
          maxSize: "2k", // Roll over to a new file when the current file size exceeds 20 MB
          maxFiles: "14d", // Keep logs for up to 14 days
        }),
      ],
    });
  },
};
