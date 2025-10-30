import { Request, Response, NextFunction } from "express";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { CreateGigUseCase } from "../../application/usecases/createGigUseCase.js";

//IMPORT IMPLEMENTATIONS
import { createGigUseCase } from "../../application/usecases/createGigUseCase.js";
export class CreateGigController {
  constructor(private createGigUseCase: CreateGigUseCase) {}
  Execute = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;
      const data = req.body;
    }
  );
}

export const createGigController = new CreateGigController(createGigUseCase);
