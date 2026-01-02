import { User } from 'prisma/generated/prisma/client.js';
import { prismaDbClient } from '@core/Prisma/prisma.client.js';

export class Admin_user_Repository {
        async deleteUserById(userId: string): Promise<User | null> {
                const user = await prismaDbClient.user.delete({
                        where: { id: userId }
                });
                return user;
        }
}

export const admin_user_Repository = new Admin_user_Repository();
