// utils/logger.ts
import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      dirname: process.env.LOG_FILE_PATH || 'logs',
      filename: 'ecics-log-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: process.env.LOG_MAX_SIZE || '100m',
    }),
    new winston.transports.Console(),
  ],
});

export default logger;
