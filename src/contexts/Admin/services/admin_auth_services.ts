import { admin_auth_Repository } from '../repository/admin_auth_Repository.js';
import { userService } from '@src/contexts/User/domain/services/UserService.js';
import { adminNotFound, adminAlreadyExists, invalidAdminPassword } from '../errors/adminErrors.js';
import {
        AdminRegistrationRequest,
        AdminRegistrationReply,
        AdminLoginRequest,
        AdminLoginReply
} from '../dto/types.js';
import { logger } from '@core/Winston/winston.js';

export class Admin_auth_Services {
        async registerAdmin(dto: AdminRegistrationRequest): Promise<AdminRegistrationReply> {
                const { firstName, lastName, email, password } = dto;

                const adminExists = await admin_auth_Repository.checkAdminExistsByEmail(email);

                if (adminExists) throw new adminAlreadyExists();

                const passwordHash = await userService.hashPassword(password);

                const admin = await admin_auth_Repository.createAdmin({
                        firstName,
                        lastName,
                        email,
                        password: passwordHash
                });

                const accessToken = userService.generateAccessToken(
                        admin.id,
                        admin.email,
                        admin.firstName,
                        admin.role
                );

                const { refreshToken, refreshTokenHash } = await userService.generateRefreshToken();

                const EXPIRES_AT = 7;
                const refreshTokenExpiry = new Date(Date.now() + EXPIRES_AT * 24 * 60 * 60 * 1000);

                await admin_auth_Repository.saveRefreshToken({
                        adminId: admin.id,
                        tokenHash: refreshTokenHash,
                        expiresAt: refreshTokenExpiry
                });

                logger.info(
                        `admin_id : ${admin.id} , admin_firstName : ${admin.firstName} ,admin_email : ${admin.email} admin_passwordHash : ${admin.passwordHash}`
                );

                return {
                        message: 'admin created successfuly',
                        refreshToken: refreshToken,
                        accessToken: accessToken
                };
        }

        async login(dto: AdminLoginRequest): Promise<AdminLoginReply> {
                const { email, password } = dto;

                const admin = await admin_auth_Repository.findAdminByEmail(email);

                if (admin === null) throw new adminNotFound();

                const isMatch = await userService.comparePassword(password, admin.passwordHash);

                if (!isMatch) throw new invalidAdminPassword();

                const accessToken = userService.generateAccessToken(
                        admin.id,
                        admin.email,
                        admin.firstName,
                        admin.role
                );

                const { refreshToken, refreshTokenHash } = await userService.generateRefreshToken();

                const EXPIRES_AT = 7;
                const refreshTokenExpiry = new Date(Date.now() + EXPIRES_AT * 24 * 60 * 60 * 1000);

                await admin_auth_Repository.saveRefreshToken({
                        adminId: admin.id,
                        tokenHash: refreshTokenHash,
                        expiresAt: refreshTokenExpiry
                });

                return {
                        message: 'login successful',
                        accessToken,
                        refreshToken: refreshToken
                };
        }

        async logout(refreshToken: string): Promise<{ message: string }> {
                await admin_auth_Repository.deleteRefreshToken(refreshToken);
                return { message: 'Logout successful' };
        }
}

export const admin_auth_Services = new Admin_auth_Services();
