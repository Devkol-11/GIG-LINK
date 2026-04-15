import type { Request, Response } from "express";
import { authService } from "../../services/auth.service.js";

export const authController = {
  async registerFreelancer(req: Request, res: Response) {
    const result = await authService.registerFreelancer(req.body);
    res.status(201).json({ data: result, message: "Freelancer registered successfully" });
  },

  async registerCreator(req: Request, res: Response) {
    const result = await authService.registerCreator(req.body);
    res.status(201).json({ data: result, message: "Creator registered successfully" });
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.status(200).json({ data: result, message: "Login successful" });
  },

  async forgotPassword(req: Request, res: Response) {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json({ data: result, message: "Password reset OTP generated" });
  },

  async resetPassword(req: Request, res: Response) {
    const result = await authService.resetPassword(req.body);
    res.status(200).json({ data: result, message: "Password reset successful" });
  },
};
