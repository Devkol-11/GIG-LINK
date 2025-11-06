"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainException = void 0;
class DomainException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "DomainException";
        this.statusCode = statusCode;
    }
}
exports.DomainException = DomainException;
