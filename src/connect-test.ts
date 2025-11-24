import { PrismaClient } from '@prisma/client';

import 'dotenv/config';

const prisma = new PrismaClient();

async function checkConnection() {
        try {
                console.log('Attempting to connect to the database...');

                await prisma.$connect();

                console.log('✅ Database connection successful!');

                const userCount = await prisma.user.count();

                console.log(
                        'simple query computed efficiently , Users in Table : ',
                        userCount
                );
        } catch (error) {
                console.error('❌ Database connection failed!');

                console.error(error);
        } finally {
                await prisma.$disconnect();
        }
}

checkConnection();
