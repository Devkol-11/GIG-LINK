'use strict';
var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
                return mod && mod.__esModule ? mod : { default: mod };
        };
Object.defineProperty(exports, '__esModule', { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
exports.config = Object.freeze({
        PORT: process.env.PORT,
        DATABASE_URL: process.env.DATABASE_URL,
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        MAIL_HOST: process.env.MAIL_HOST,
        MAIL_PORT: process.env.MAIL_PORT,
        MAIL_USERNAME: process.env.MAIL_USERNAME,
        MAIL_PASSWORD: process.env.MAIL_PASSWORD,
        MAIL_FROM: process.env.MAIL_FROM
});
