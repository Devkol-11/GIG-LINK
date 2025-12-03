import { Request, Response, NextFunction } from 'express';
import { jwtLibary } from '@src/contexts/Auth/adapters/Jwt-impl.js';

export class AuthMiddlewares {
        constructor() {}

        public Authenticate(req: Request, res: Response, next: NextFunction) {
                const authHeader = req.headers.authorization;

                if (!authHeader || !authHeader.startsWith('Bearer')) {
                        return res
                                .status(401)
                                .json({ message: 'Missing or invalid token' });
                }

                const token = authHeader.split(' ')[1];

                const decoded = jwtLibary.verifyAccessToken(token);

                if (!decoded) {
                        return res
                                .status(401)
                                .json({ message: 'Invalid or Expired token' });
                }

                Object.defineProperty(req, 'user', {
                        value: decoded,
                        writable: false,
                        enumerable: true
                });

                next();
        }

        public Authorize = (...allowedRoles: string[]) => {
                return (req: Request, res: Response, next: NextFunction) => {
                        if (!req.user) {
                                return res.status(403).json({
                                        message: 'Not authenticated'
                                });
                        }

                        if (!allowedRoles.includes(req.user.role)) {
                                return res
                                        .status(403)
                                        .json({ message: 'not allowed' });
                        }

                        next();
                };
        };
}

export const { Authenticate, Authorize } = new AuthMiddlewares();
