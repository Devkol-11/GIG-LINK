import { Request, Response, NextFunction } from "express";
import { LoginUseCase } from "../../application/useCases/LoginUseCase";
import { sendResponse } from "@src/shared/helpers/ResponseHelpers";
import { httpStatus } from "@src/shared/constants/httpStatusCode";
//import implementation
import { loginUseCase } from "../../application/useCases/LoginUseCase";
import { logger } from "@core/logging/winston";

export class LoginController {
  constructor(private loginUseCase: LoginUseCase) {}

  async Execute(req: Request, res: Response, next: NextFunction) {
    logger.info("[Controller] Register called", { body: req.body });

    try {
      const { email, password } = req.body;
      const response = this.loginUseCase.Execute({ email, password });
      sendResponse(res, httpStatus.Success, response);
    } catch (error) {
      next(error);
    }
  }
}

export const loginController = new LoginController(loginUseCase);
