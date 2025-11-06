import { Request, Response, NextFunction } from "express";
import { ListApplicationsUseCase } from "../../application/usecases/listApplicationsUseCase.js";
import { catchAsync } from "@src/shared/helpers/catchAsync.js";
import { sendResponse } from "@src/shared/helpers/sendResponse.js";

//IMPORT IMPLEMENTATIONS
import { listApplicationsUseCase } from "../../application/usecases/listApplicationsUseCase.js";

export class ListApplicationsController {
  constructor(
    private readonly listApplicationsUseCase: ListApplicationsUseCase
  ) {}

  Execute = catchAsync(
    async (req: Request, res: Response, _next: NextFunction) => {
      const userId = req.user?.userId;
      const role = req.user?.role;

      const { applications, total, page, totalPages } =
        await this.listApplicationsUseCase.Execute(userId, role);

      sendResponse(res, 200, {
        message: "Applications fetched successfully",
        count: applications.length,
        applications,
        total,
        page,
        totalPages,
      });
    }
  );
}

export const listApplicationsController = new ListApplicationsController(
  listApplicationsUseCase
);
