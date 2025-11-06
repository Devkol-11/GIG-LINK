// src/modules/marketplace/controllers/deleteGigController.ts
import { Request, Response, NextFunction } from "express";
import { DeleteGigUseCase } from "../../application/usecases/deleteGigUseCase.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

//IMPORT IMPLEMENTATIONS
import { deleteGigUseCase } from "../../application/usecases/deleteGigUseCase.js";

export class DeleteGigController {
  constructor(private readonly deleteGigUseCase: DeleteGigUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const { id } = req.params;
      const role = req.user.role

      await this.deleteGigUseCase.Execute(id , role);

      sendResponse(res, 200, {
        message: "Gig deleted successfully",
      });
    }
  );
}

export const deleteGigController = new DeleteGigController(deleteGigUseCase);
