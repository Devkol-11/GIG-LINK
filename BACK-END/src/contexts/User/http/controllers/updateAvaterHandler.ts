import { Request, Response, NextFunction } from "express";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";
import { UpdateAvatarUseCase } from "../../application/useCases/updateAvatarUsecase.js";

//IMPORT IMPLEMENTATION
import { updateAvatarUseCase } from "../../application/useCases/updateAvatarUsecase.js";

export class UpdateAvatarHandler {
  constructor(private updateAvatarUseCase: UpdateAvatarUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user.id;
      const { newAvatarUrl } = req.body;
      const response = await this.updateAvatarUseCase.Execute(
        userId,
        newAvatarUrl
      );
      sendResponse(res, httpStatus.Success, response);
    }
  );
}

export const updateAvatarHandler = new UpdateAvatarHandler(updateAvatarUseCase);
