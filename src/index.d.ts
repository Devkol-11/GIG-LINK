import { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

declare global {
        var prisma: PrismaClient;
}

declare global {
        namespace NodeJS {
                interface ProcessEnv {
                        NODE_ENV: 'development' | 'production' | 'test';
                        PORT: number;
                        DATABASE_URL: string;
                        ACCESS_TOKEN_SECRET: string;
                        REFRESH_TOKEN_SECRET: string;
                        MAIL_HOST: string;
                        MAIL_PORT: string;
                        MAIL_USERNAME: string;
                        MAIL_PASSWORD: string;
                        MAIL_FROM: string;
                        PAYSTACK_TEST_SECRET_KEY: string;
                        PAYSTACK_TEST_PUBLIC_KEY: string;
                }
        }
}

declare global {
        namespace Express {
                export interface Request {
                        user: JwtPayload & {
                                userId: string;
                                email: string;
                                firstName: string;
                                role: 'CREATOR' | 'FREELANCER';
                        };

                        rawBody: string;
                }
        }
}
