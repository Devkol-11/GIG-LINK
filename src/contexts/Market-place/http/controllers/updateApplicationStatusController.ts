import { Request, Response, NextFunction } from "express";
import { UpdateApplicationUseCase } from "../../application/usecases/updateApplicationStatusUseCase.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

//IMPORT IMPLEMENTATIONS
import { updateApplicationUseCase } from "../../application/usecases/updateApplicationStatusUseCase.js";

export class UpdateApplicationStatusController {
  constructor(private updateApplicationUsecase: UpdateApplicationUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const applicationId = req.params.id;
      const updates = req.body;
      const role = req.user?.role;

      const response = await this.updateApplicationUsecase.Execute(
        applicationId,
        updates,
        role
      );

      sendResponse(res, 200, {
        message: "Update Successful",
        data: response,
      });
    }
  );
}

export const updateApplicationStatusController =
  new UpdateApplicationStatusController(updateApplicationUseCase);
