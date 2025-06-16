
const expressWinston = require('express-winston');
const { format, transports } = require('winston');

const requestLogger = expressWinston.logger({
  transports: [
    new transports.File({ filename: 'request.log' })
  ],
  format: format.json(),
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new transports.File({ filename: 'error.log' })
  ],
  format: format.json(),
});

module.exports = { requestLogger, errorLogger };