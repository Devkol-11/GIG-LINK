// src/modules/marketplace/controllers/createGigController.ts
import { Request, Response, NextFunction } from "express";
import { CreateGigUseCase } from "../../application/usecases/createGigUseCase.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

//IMPORT IMPLEMENTATIONS
import { createGigUseCase } from "../../application/usecases/createGigUseCase.js";

export class CreateGigController {
  constructor(private readonly createGigUseCase: CreateGigUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { title, description, price, category, tags, deadline } = req.body;
      const creatorId = req.user?.userId;

      const gig = await this.createGigUseCase.Execute({
        title,
        description,
        price,
        category,
        tags,
        deadline,
        creatorId,
      });

      sendResponse(res, 200, {
        message: "Gig Created successfuly",
        gig,
      });
    }
  );
}

export const createGigController = new CreateGigController(createGigUseCase);
