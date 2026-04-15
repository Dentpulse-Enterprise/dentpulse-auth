export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static notFound(message = "Not found") {
    return new ApiError(404, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }

  static badGateway(message = "Bad gateway") {
    return new ApiError(502, message);
  }
}
