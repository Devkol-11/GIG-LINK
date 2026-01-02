import { prismaDbClient } from '@core/Prisma/prisma.client.js';
import { Admin } from 'prisma/generated/prisma/client.js';
import { Refresh_Token_Admin } from 'prisma/generated/prisma/client.js';

export class Admin_auth_Repository {
        async createAdmin(data: {
                firstName: string;
                lastName: string;
                password: string;
                email: string;
        }): Promise<Admin> {
                const admin = await prismaDbClient.admin.create({
                        data: {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email,
                                passwordHash: data.password
                        }
                });

                return admin;
        }

        async findAdminByEmail(email: string) {
                const record = await prismaDbClient.admin.findUnique({
                        where: {
                                email: email
                        }
                });

                return record ? record : null;
        }

        async checkAdminExistsByEmail(email: string): Promise<boolean> {
                const admin = await prismaDbClient.admin.findUnique({
                        where: { email }
                });
                return admin ? true : false;
        }

        async saveRefreshToken(data: {
                adminId: string;
                tokenHash: string;
                expiresAt: Date;
        }): Promise<Refresh_Token_Admin> {
                const { adminId, tokenHash, expiresAt } = data;
                const record = await prismaDbClient.refresh_Token_Admin.create({
                        data: {
                                adminId,
                                tokenHash,
                                expiresAt
                        }
                });

                return record;
        }

        async deleteRefreshToken(refreshToken: string): Promise<void> {
                await prismaDbClient.refresh_Token_Admin.deleteMany({
                        where: {
                                tokenHash: refreshToken
                        }
                });
        }
}

export const admin_auth_Repository = new Admin_auth_Repository();
