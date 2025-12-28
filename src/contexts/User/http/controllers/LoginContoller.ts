import { Request, Response, NextFunction } from 'express';
import { LoginUseCase, loginUseCase } from '../../application/useCases/LoginUseCase.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';

export class LoginController {
        constructor(private loginUseCase: LoginUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { email, password } = req.body;
                const response = await this.loginUseCase.execute({
                        email,
                        password
                });

                return sendResponse(res, httpStatus.Success, response, response.tokens.refreshToken);
        });
}

export const loginController = new LoginController(loginUseCase);
