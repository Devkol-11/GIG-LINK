'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
        constructor(message, statusCode = 500, isOperational = true) {
                super(message);
                Object.setPrototypeOf(this, new.target.prototype);
                this.statusCode = statusCode;
                this.isOperational = isOperational;
                this.message = message;
                Error.captureStackTrace(this);
        }
}
exports.HttpError = HttpError;
