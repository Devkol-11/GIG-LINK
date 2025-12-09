import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import {
        RegisterCreatorUseCase,
        registerCreatorUseCase
} from '../../application/useCases/RegisterCreatorUseCase.js';

export class RegisterCreatorController {
        constructor(
                private readonly registerCreatorUseCase: RegisterCreatorUseCase
        ) {}

        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const {
                                email,
                                password,
                                phoneNumber,
                                firstName,
                                lastName
                        } = req.body;

                        const data = await this.registerCreatorUseCase.Execute({
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

                        return sendResponse(
                                res,
                                httpStatus.Created,
                                response,
                                refreshToken
                        );
                }
        );
}

export const registerCreatorController = new RegisterCreatorController(
        registerCreatorUseCase
);
