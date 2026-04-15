import dotenv from "dotenv";
dotenv.config();

export const config = Object.freeze({
  PORT: process.env.PORT,
});
