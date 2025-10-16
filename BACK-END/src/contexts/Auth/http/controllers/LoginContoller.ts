import { Request, Response, NextFunction } from "express";
import { LoginUseCase } from "../../application/useCases/LoginUseCase";
import { sendResponse } from "@src/shared/helpers/sendResponse";
import { httpStatus } from "@src/shared/constants/httpStatusCode";
import { catchAsync } from "@src/shared/helpers/catchAsync";

//IMPOER TIMPLEMENTATIONS
import { loginUseCase } from "../../application/useCases/LoginUseCase";
import { logger } from "@core/logging/winston";

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      const data = await this.loginUseCase.Execute({ email, password });

      const response = {
        message: data.message,
        user: data.user,
        accessToken: data.tokens.accessToken,
      };

      const refreshToken = data.tokens.refreshToken;

      sendResponse(res, httpStatus.Success, response, refreshToken);
    }
  );
}

export const loginController = new LoginController(loginUseCase);
