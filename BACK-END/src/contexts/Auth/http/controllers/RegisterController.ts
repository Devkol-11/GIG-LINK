import { Request, Response, NextFunction } from "express";
import { RegisterUseCase } from "../../application/useCases/RegisterUseCase";
import { sendResponse } from "../../../../shared/helpers/sendResponse";
import { httpStatus } from "../../../../shared/constants/httpStatusCode";
import { catchAsync } from "@src/shared/helpers/catchAsync";

//IMPORT IMPLEMENTATION
import { registerUseCase } from "../../application/useCases/RegisterUseCase";

export class RegisterController {
  constructor(private registerUseCase: RegisterUseCase) {}

  Execute = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password, phoneNumber, firstName, lastName } = req.body;
      const data = await this.registerUseCase.Execute({
        email,
        password,
        phoneNumber,
        firstName,
        lastName,
      });

      const response = {
        message: data.message,
        user: data.user,
        accessToken: data.tokens.accessToken,
      };

      const refreshToken = data.tokens.refreshToken;

      sendResponse(res, httpStatus.Created, response, refreshToken);
    }
  );
}

export const registerController = new RegisterController(registerUseCase);
