import { Request, Response, NextFunction } from "express";
import { ForgotPasswordUseCase } from "../../application/useCases/ForgotPasswordUseCase";
import { sendResponse } from "@src/shared/helpers/sendResponse";
import { httpStatus } from "@src/shared/constants/httpStatusCode";
import { catchAsync } from "@src/shared/helpers/catchAsync";

// IMPORT IMPLEMENTATIONS
import { forgotPasswordUseCase } from "../../application/useCases/ForgotPasswordUseCase";

export class ForgotPasswordController {
  constructor(private forgotPasswordUseCase: ForgotPasswordUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email } = req.body;

      const response = await this.forgotPasswordUseCase.Execute(email);

      sendResponse(res, httpStatus.Success, response);
    }
  );
}

export const forgotPasswordController = new ForgotPasswordController(
  forgotPasswordUseCase
);
