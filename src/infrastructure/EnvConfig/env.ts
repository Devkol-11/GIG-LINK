import path, { parse } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { logger } from '@core/Winston/winston.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.resolve(__dirname, '../../../.env');

const result = dotenv.config({ path: ENV_PATH });

if (result.error) {
        console.error(`Failed to load .env from: ${ENV_PATH}`);
        throw result.error;
}

function getEnvVar(key: string): string {
        const value = process.env[key];
        if (!value) throw new Error(`Missing environment variable: ${key}`);
        return value;
}

export const config = Object.freeze({
        PORT: getEnvVar('PORT'),
        NODE_ENV: getEnvVar('NODE_ENV'),
        DATABASE_URL: getEnvVar('DATABASE_URL'),
        DIRECT_DATABASE_URL: getEnvVar('DIRECT_DATABASE_URL'),
        ACCESS_TOKEN_SECRET: getEnvVar('ACCESS_TOKEN_SECRET'),
        REFRESH_TOKEN_SECRET: getEnvVar('REFRESH_TOKEN_SECRET'),
        MAIL_HOST: getEnvVar('MAIL_HOST'),
        MAIL_PORT: getEnvVar('MAIL_PORT'),
        MAIL_USERNAME: getEnvVar('MAIL_USERNAME'),
        MAIL_PASSWORD: getEnvVar('MAIL_PASSWORD'),
        MAIL_FROM: getEnvVar('MAIL_FROM'),
        PAYSTACK_TEST_SECRET_KEY: getEnvVar('PAYSTACK_TEST_SECRET_KEY'),
        PAYSTACK_TEST_PUBLIC_KEY: getEnvVar('PAYSTACK_TEST_PUBLIC_KEY'),
        REDIS_HOST: getEnvVar('REDIS_HOST'),
        REDIS_PORT: getEnvVar('REDIS_PORT') ? parseInt(getEnvVar('REDIS_PORT')) : undefined,
        REDIS_PASSWORD: getEnvVar('REDIS_PASSWORD'),
        REDIS_DB: getEnvVar('REDIS_DB')
});

logger.info(` Loaded environment variables from: ${ENV_PATH}`);
