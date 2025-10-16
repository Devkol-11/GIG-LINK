import { Request, Response, NextFunction } from "express";
import { ResetPasswordUseCase } from "../../application/useCases/ResetPasswordUseCase";
import { sendResponse } from "@src/shared/helpers/sendResponse";
import { catchAsync } from "@src/shared/helpers/catchAsync";
import { httpStatus } from "@src/shared/constants/httpStatusCode";

//IMPORT IMPLEMENTATIONS
import { resetPasswordUseCase } from "../../application/useCases/ResetPasswordUseCase";

export class ResetPasswordController {
  constructor(private resetPasswordUseCase: ResetPasswordUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { otp, password } = req.body;
      const response = await this.resetPasswordUseCase.Execute(otp, password);
      sendResponse(res, httpStatus.Success, response);
    }
  );
}

export const resetPasswordController = new ResetPasswordController(
  resetPasswordUseCase
);
