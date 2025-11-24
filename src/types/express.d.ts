import { JwtPayload } from 'jsonwebtoken';

declare namespace Express {
        export interface Request {
                user?: JwtPayload & {
                        userId: string;

                        email: string;

                        role: 'CREATOR' | 'FREELANCER';
                };
        }
}
