import dotenv from "dotenv";
dotenv.config();

export const config = Object.freeze({
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
});
