const UNAUTHORIZED_CODE = 401;

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_CODE;
  }
}

module.exports = UnauthorizedError;
