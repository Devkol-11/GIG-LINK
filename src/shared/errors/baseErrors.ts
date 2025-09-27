import { AppError } from "./appError";

export class NotFound extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class BadRequest extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class Unauthorized extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class Forbidden extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class InternalServer extends AppError {
  constructor(message = "Internal server error") {
    super(message, 500);
  }
}
