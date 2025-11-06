import { Request, Response, NextFunction } from "express";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";
import { GetProfileUseCase } from "../../application/useCases/getProfileUsecase.js";

//IMPORT IMPLEMENTATION
import { getProfileUseCase } from "../../application/useCases/getProfileUsecase.js";
import { httpStatus } from "@src/shared/constants/httpStatusCode.js";

export class GetProfileHandler {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const profileId = req.params.id;
      console.log(profileId);
      console.log(typeof profileId);
      const response = await this.getProfileUseCase.Execute(profileId);
      sendResponse(res, httpStatus.Success, response);
    }
  );
}

export const getProfileHandler = new GetProfileHandler(getProfileUseCase);
