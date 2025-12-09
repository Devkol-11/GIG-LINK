import jwt from 'jsonwebtoken';
import { ITokenGenerator } from '../ports/TokenGenerator.js';
import { config } from '@src/infrastructure/env-config/env.js';

class JwtLibary implements ITokenGenerator {
        constructor(
                private accessSecretKey: string,
                private refreshSecretKey: string
        ) {}

        generateAccessToken(payload: object): string {
                return jwt.sign(payload, this.accessSecretKey, {
                        expiresIn: '15m'
                });
        }

        generateRefreshToken(payload: object): any {
                return jwt.sign(payload, this.refreshSecretKey, {
                        expiresIn: '7d'
                });
        }

        verifyAccessToken(token: string) {
                return jwt.verify(token, this.accessSecretKey);
        }

        verifyRefreshToken(token: string) {
                return jwt.verify(token, this.refreshSecretKey);
        }
}

export const jwtLibary = new JwtLibary(
        config.ACCESS_TOKEN_SECRET,
        config.REFRESH_TOKEN_SECRET
);
