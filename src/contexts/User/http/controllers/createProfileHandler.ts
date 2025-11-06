import { Request, Response, NextFunction } from "express";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { CreateProfileUseCase } from "../../application/useCases/createProfileUsecase.js";

//IMPORT IMPLEMENTATION
import { createProfileUseCase } from "../../application/useCases/createProfileUsecase.js";

export class CreateProfileHandler {
  constructor(private createProfileUseCase: CreateProfileUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = req.user.userId;
      const profile = req.body;

      const response = await this.createProfileUseCase.Execute(userId, profile);

      sendResponse(res, httpStatus.Created, response);
    }
  );
}

export const createProfileHandler = new CreateProfileHandler(
  createProfileUseCase
);
