import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { logger } from '@core/logging/winston.js';

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
        GOOGLE_CLIENT_ID: getEnvVar('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET: getEnvVar('GOOGLE_CLIENT_SECRET'),
        GOOGLE_CALLBACK_URL: getEnvVar('GOOGLE_CALLBACK_URL')
});

logger.info(` Loaded environment variables from: ${ENV_PATH}`);
