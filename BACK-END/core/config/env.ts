import dotenv from "dotenv";
dotenv.config();

export const config = Object.freeze({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
});
