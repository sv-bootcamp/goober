import logger from 'winston';

export class APIError {
  constructor(error, options = {}) {
    this.error = error;
    this.statusCode = options.statusCode || 500;
    this.message = options.message || 'Internal Server Error';
  }
}

export function handle404(req, res) {
  if (!res.headersSent) {
    res.status(404).send('Request > 404 - Page Not Found');
    logger.error(`404 Not Found - ${req.method} - PATH : ${req.originalUrl} - ${new Date()}`);
  }
}

export const ERRNO = {
  USER_EXIST: 1000001
};
