import { Request, Response } from "express";
import {
  checkPaymentStatusUseCase,
  CheckPaymentStatusUseCase,
} from "../../application/useCases/CheckPaymentStatusUseCase.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

export class CheckPaymentStatusController {
  constructor(private checkPaymentStatusUseCase: CheckPaymentStatusUseCase) {}

  async Execute(req: Request, res: Response) {
    const { paymentId } = req.params;

    const result = await this.checkPaymentStatusUseCase.execute(paymentId);

    return sendResponse(res, 200, { data: result });
  }
}

export const checkPaymentStatusController = new CheckPaymentStatusController(
  checkPaymentStatusUseCase
);
