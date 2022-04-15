const winston = require('winston');
const fs = require('fs');
const moment = require('moment');
require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: 'debug',
    transports: [
        new winston.transports.DailyRotateFile({
            filename: 'log/error.log',
            level: 'error',
            zippedArchive: true,
            format: winston.format.printf(
                info => `${moment().format('YYYY-MM-DD a h:mm:ss')} [${info.level.toUpperCase()}] - ${info.message}`
            ),
        }),
        new winston.transports.DailyRotateFile({
            filename: 'log/combined.log',
            level: 'info',
            zippedArchive: true,
            format: winston.format.printf(
                info => `${moment().format('YYYY-MM-DD a h:mm:ss')} [${info.level.toUpperCase()}] - ${info.message}`
            ),
        }),
    ]
});

module.exports = logger;