import { Request, Response, NextFunction } from "express";
import { RegisterUserUseCase } from "../../application/useCases/RegisterUserUseCase";
import { sendResponse } from "../../../../shared/helpers/ResponseHelpers";
import { httpStatus } from "../../../../shared/constants/httpStatusCode";

export class RegisterController {
  constructor(private registerUseCase: RegisterUserUseCase) {}

  async Execute(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, phoneNumber, firstName, lastName } = req.body;

      const data = await this.registerUseCase.Execute({
        email,
        password,
        phoneNumber,
        firstName,
        lastName,
      });

      sendResponse(res, httpStatus.Success, data);
    } catch (error) {
      next(error);
    }
  }
}
