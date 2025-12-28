import { Request, Response, NextFunction } from 'express';
import {
        RegisterFreeLancerUseCase,
        registerFreeLancerUseCase
} from '../../application/useCases/RegisterFreeLancerUseCase.js';
import { sendResponse } from '../../../../shared/helpers/sendResponse.js';
import { httpStatus } from '../../../../shared/constants/httpStatusCode.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';

export class RegisterFreeLancerController {
        constructor(private registerFreelancerUseCase: RegisterFreeLancerUseCase) {}

        execute = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
                const { email, password, phoneNumber, firstName, lastName } = req.body;

                const data = await this.registerFreelancerUseCase.execute({
                        email,
                        password,
                        phoneNumber,
                        firstName,
                        lastName
                });

                const response = {
                        message: data.message,
                        user: data.user,
                        accessToken: data.tokens.accessToken
                };

                const refreshToken = data.tokens.refreshToken;

                return sendResponse(res, httpStatus.Created, response, refreshToken);
        });
}

export const registerFreeLancerController = new RegisterFreeLancerController(registerFreeLancerUseCase);
