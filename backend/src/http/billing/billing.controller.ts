import type { Request, Response } from "express";
import { billingService } from "../../services/billing.service.js";

export const billingController = {
  async createPayment(req: Request, res: Response) {
    const result = await billingService.createPayment(req.user!.id, req.body);
    res.status(201).json({ data: result, message: "Payment created successfully" });
  },

  async verifyPayment(req: Request, res: Response) {
    const result = await billingService.verifyPayment(req.user!.id, req.body);
    res.status(200).json({ data: result, message: "Payment verified successfully" });
  },

  async createWallet(req: Request, res: Response) {
    const result = await billingService.createWallet(req.user!.id, req.body);
    res.status(201).json({ data: result, message: "Wallet recipient created successfully" });
  },

  async getWalletPayments(req: Request, res: Response) {
    const result = await billingService.getWalletPayments(req.user!.id);
    res.status(200).json({ data: result, message: "Wallet payments fetched successfully" });
  },

  async requestWithdrawal(req: Request, res: Response) {
    const result = await billingService.requestWithdrawal(req.user!.id, req.body);
    res.status(201).json({ data: result, message: "Withdrawal requested successfully" });
  },

  async getWithdrawals(req: Request, res: Response) {
    const result = await billingService.getWithdrawals(req.user!.id);
    res.status(200).json({ data: result, message: "Withdrawals fetched successfully" });
  },

  async fundEscrow(req: Request, res: Response) {
    const result = await billingService.fundEscrow(req.user!.id, req.body);
    res.status(201).json({ data: result, message: "Escrow funded successfully" });
  },

  async releaseEscrow(req: Request, res: Response) {
    const result = await billingService.releaseEscrow(req.user!.id, req.body);
    res.status(200).json({ data: result, message: "Escrow released successfully" });
  },
};
