import { HttpError } from "./httpError.js";

export class NotFound extends HttpError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequest extends HttpError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class Unauthorized extends HttpError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class Forbidden extends HttpError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class InternalServer extends HttpError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}

export class conflictError extends HttpError {
  constructor(message = "Resource conflict") {
    super(message, 409);
  }
}
export class serviceUnavailable extends HttpError {
  constructor(message = "service unavailable") {
    super(message, 503);
  }
}
