export class APIError {
  constructor(error, options = {}) {
    this.error = error;
    this.statusCode = options.statusCode || 500;
    this.message = options.message || 'Internal Server Error';
  }
}

