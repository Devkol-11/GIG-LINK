import { Request, Response, NextFunction } from "express";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { GetContractUseCase } from "../../application/usecases/getContractUseCase.js";

//IMPORT IMPLEMENTATION
import { getContractUseCase } from "../../application/usecases/getContractUseCase.js";
export class GetContractController {
  constructor(private getContractUseCase: GetContractUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { userId } = req.user;
      const { contractId } = req.params;
      const { role } = req.user;

      const response = this.getContractUseCase.Execute(
        userId,
        role,
        contractId
      );
      sendResponse(res, 200, {
        message: "Successful",
        response,
      });
    }
  );
}

export const getContractController = new GetContractController(
  getContractUseCase
);
