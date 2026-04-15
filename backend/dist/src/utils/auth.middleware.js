import jwt from "jsonwebtoken";
import { AppError } from "./error.js";
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
export function authMiddleware(req, _res, next) {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
        return next(new AppError("Unauthorized", 401));
    }
    const token = authorization.replace("Bearer ", "");
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        };
        return next();
    }
    catch {
        return next(new AppError("Invalid or expired token", 401));
    }
}
