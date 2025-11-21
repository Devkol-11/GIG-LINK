'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.serviceUnavailable =
        exports.conflictError =
        exports.InternalServer =
        exports.Forbidden =
        exports.Unauthorized =
        exports.BadRequest =
        exports.NotFound =
                void 0;
const httpError_1 = require('./httpError');
class NotFound extends httpError_1.HttpError {
        constructor(message = 'Resource not found') {
                super(message, 404);
        }
}
exports.NotFound = NotFound;
class BadRequest extends httpError_1.HttpError {
        constructor(message = 'Bad request') {
                super(message, 400);
        }
}
exports.BadRequest = BadRequest;
class Unauthorized extends httpError_1.HttpError {
        constructor(message = 'Unauthorized') {
                super(message, 401);
        }
}
exports.Unauthorized = Unauthorized;
class Forbidden extends httpError_1.HttpError {
        constructor(message = 'Forbidden') {
                super(message, 403);
        }
}
exports.Forbidden = Forbidden;
class InternalServer extends httpError_1.HttpError {
        constructor(message = 'Internal server error') {
                super(message, 500);
        }
}
exports.InternalServer = InternalServer;
class conflictError extends httpError_1.HttpError {
        constructor(message = 'Resource conflict') {
                super(message, 409);
        }
}
exports.conflictError = conflictError;
class serviceUnavailable extends httpError_1.HttpError {
        constructor(message = 'service unavailable') {
                super(message, 503);
        }
}
exports.serviceUnavailable = serviceUnavailable;
