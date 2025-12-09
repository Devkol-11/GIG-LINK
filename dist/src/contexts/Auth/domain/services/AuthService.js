'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.authservice = exports.AuthService = void 0;
const crypto_1 = require('crypto');
//IMPORT IMPLEMANTATIONS
const JwtService_1 = require('../../infrastructure/JwtService');
const BcryptService_1 = require('../../infrastructure/BcryptService');
class AuthService {
        constructor(tokenGenerator, passwordHasher) {
                this.tokenGenerator = tokenGenerator;
                this.passwordHasher = passwordHasher;
        }
        async hashPassword(password) {
                return this.passwordHasher.hash(password);
        }
        async comparePassword(plainPassoword, hashedPassword) {
                return this.passwordHasher.compare(
                        plainPassoword,
                        hashedPassword
                );
        }
        generateAccessToken(email, userId) {
                return this.tokenGenerator.generateAccessToken({
                        userId,
                        email
                });
        }
        generateRefreshToken(userId, email) {
                return this.tokenGenerator.generateRefreshToken({
                        userId,
                        email
                });
        }
        verifyAccessToken(token) {
                return this.tokenGenerator.verifyAccessToken(token);
        }
        verifyRefreshToken(token) {
                return this.tokenGenerator.verifyRefreshToken(token);
        }
        generateTemporaryToken(expiresInMinutes = 15) {
                const token = (0, crypto_1.randomUUID)();
                const expiresAt = new Date(
                        Date.now() + 1000 * 60 * expiresInMinutes
                );
                return { token, expiresAt };
        }
}
exports.AuthService = AuthService;
exports.authservice = new AuthService(
        JwtService_1.jwtLibary,
        BcryptService_1.bcryptLibary
);
