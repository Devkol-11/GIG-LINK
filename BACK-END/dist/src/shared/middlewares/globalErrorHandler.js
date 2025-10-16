"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const winston_1 = require("@core/logging/winston");
const DomainException_1 = require("@src/contexts/Auth/domain/exceptions/DomainException");
const ResponseHelpers_1 = require("../helpers/ResponseHelpers");
const httpError_1 = require("../errors/httpError");
const globalErrorHandler = (err, _req, res, _next) => {
    winston_1.logger.error(err);
    if (err instanceof DomainException_1.DomainException) {
        return (0, ResponseHelpers_1.sendResponse)(res, err.statusCode, {
            err,
            message: err.message,
        });
    }
    if (err instanceof httpError_1.HttpError) {
        return (0, ResponseHelpers_1.sendResponse)(res, err.statusCode, err.message);
    }
    return (0, ResponseHelpers_1.sendResponse)(res, 500, "Internal Server Error");
};
exports.globalErrorHandler = globalErrorHandler;
