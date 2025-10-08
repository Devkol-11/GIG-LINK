import { Request, Response, NextFunction } from "express";
import { RegisterUseCase } from "../../application/useCases/RegisterUseCase";
import { sendResponse } from "../../../../shared/helpers/ResponseHelpers";
import { httpStatus } from "../../../../shared/constants/httpStatusCode";
//Import Implementation
import { registerUseCase } from "../../application/useCases/RegisterUseCase";
import { logger } from "@core/logging/winston";
export class RegisterController {
  constructor(private registerUseCase: RegisterUseCase) {}

  async Execute(req: Request, res: Response, next: NextFunction) {
    logger.info(`request body :  ${req.body}`);

    try {
      const { email, password, phoneNumber, firstName, lastName } = req.body;
      logger.info("delegating to usecase");
      const response = await this.registerUseCase.Execute({
        email,
        password,
        phoneNumber,
        firstName,
        lastName,
      });
      logger.info("response gotting sending response to client");
      sendResponse(res, httpStatus.Success, response);
    } catch (error) {
      next(error);
    }
  }
}

export const registerController = new RegisterController(registerUseCase);
