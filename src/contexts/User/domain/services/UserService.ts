import { IpasswordHasher } from '../../ports/IPasswordHasher.js';
import { ITokenGenerator } from '../../ports/ITokenGenerator.js';
import { randomBytes } from 'crypto';
import { jwtLibary } from '../../adapters/Jwt-impl.js';
import { bcryptLibary } from '../../adapters/Bcrypt-impl.js';
import { IAvatarGenerator } from '../../ports/IAvatarGenerator.js';
import { avatarGenerator } from '../../adapters/avatarGenerator.js';

export class UserService {
        constructor(
                private tokenGenerator: ITokenGenerator,
                private passwordHasher: IpasswordHasher,
                private avatarGenerator: IAvatarGenerator
        ) {}

        async hashPassword(password: string): Promise<string> {
                return this.passwordHasher.hash(password);
        }

        async comparePassword(plainPassoword: string, hashedPassword: string): Promise<boolean> {
                return this.passwordHasher.compare(plainPassoword, hashedPassword);
        }

        generateAccessToken(userId: string, email: string, firstName: string, role: string): string {
                return this.tokenGenerator.generateAccessToken({
                        userId,
                        email,
                        firstName,
                        role
                });
        }

        verifyAccessToken(token: string): any {
                return this.tokenGenerator.verifyAccessToken(token);
        }
        async generateRefreshToken() {
                const refreshToken = randomBytes(32).toString('base64url');
                const refreshTokenHash = await this.hashRefreshToken(refreshToken);
                return { refreshToken, refreshTokenHash };
        }

        async hashRefreshToken(token: string) {
                const tokenHash = await this.passwordHasher.hash(token);
                return tokenHash;
        }

        generateOTP(ttlMinutes = 10) {
                const rawToken = randomBytes(4).readUInt32BE(0);
                const otp = (rawToken % 1000000).toString().padStart(6, '0');
                const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
                return { otp, expiresAt };
        }

        createAvatar() {
                const avatar = this.avatarGenerator.generateAvatar();
                return avatar;
        }
}

export const userService = new UserService(jwtLibary, bcryptLibary, avatarGenerator);
