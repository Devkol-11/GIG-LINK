import { Request, Response, NextFunction } from "express";
import { UpdateGigUseCase } from "../../application/usecases/updateGigUseCase.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

//IMPORT IMPLEMENTATIONS
import { updateGigUseCase } from "../../application/usecases/updateGigUseCase.js";

export class UpdateGigController {
  constructor(private readonly updateGigUseCase: UpdateGigUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const gigId = req.params.id;
      const updates = req.body;
      const userId = req.user?.userId;

      const updatedGig = await this.updateGigUseCase.Execute(
        gigId,
        updates,
        userId
      );

      sendResponse(res, 200, {
        message: "Gig updated successfully",
        gig: updatedGig,
      });
    }
  );
}

export const updateGigController = new UpdateGigController(updateGigUseCase);
