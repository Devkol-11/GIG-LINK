import { ZodError } from "zod";
export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
export function errorHandler(error, _req, res, _next) {
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: true,
            message: error.issues.map((issue) => issue.message).join(", "),
            statusCode: 400,
        });
    }
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: true,
            message: error.message,
            statusCode: error.statusCode,
        });
    }
    return res.status(500).json({
        error: true,
        message: "Internal server error",
        statusCode: 500,
    });
}
