import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: any,
  refreshToken?: string
) => {
  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({
      ...data,
    });
};
