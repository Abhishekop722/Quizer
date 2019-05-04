const winston = require('winston');
const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({filename:'error.log',level:'error'}),
        new winston.transports.File({filename:'combined.log'}),
    ]
});
module.exports = logger;