import { Request, Response, NextFunction } from "express";
import { GetGigUseCase } from "../../application/usecases/getGigUseCase.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

//IMPORT IMPLEMENTATIONS
import { getGigUseCase } from "../../application/usecases/getGigUseCase.js";

export class GetGigController {
  constructor(private readonly getGigUseCase: GetGigUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;

      const gig = await this.getGigUseCase.Execute(id);

      sendResponse(res, 200, {
        message: "Gig fetched successfully",
        gig,
      });
    }
  );
}

export const getGigController = new GetGigController(getGigUseCase);
