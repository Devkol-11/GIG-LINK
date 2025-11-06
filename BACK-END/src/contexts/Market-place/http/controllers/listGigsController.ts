import { ListGigsUseCase } from "../../application/usecases/listGigsUseCase.js";
import { Request, Response, NextFunction } from "express";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

//IMPORT IMPLEMENTATIONS
import { listGigsUseCase } from "../../application/usecases/listGigsUseCase.js";

export class ListGigsController {
  constructor(private readonly listGigsUseCase: ListGigsUseCase) {}

  Execute = catchAsync(
    async (_req: Request, res: Response, _next: NextFunction) => {
      const gigs = await this.listGigsUseCase.Execute();

      sendResponse(res, 200, {
        message: "Gigs fetched successfully",
        gigs,
      });
    }
  );
}

export const listGigsController = new ListGigsController(listGigsUseCase);
