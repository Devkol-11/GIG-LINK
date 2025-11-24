import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';
import { httpStatus } from '@src/shared/constants/httpStatusCode.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import {
        GoogleAuthUseCase,
        googleAuthUseCase
} from '../../application/useCases/GoogleAuthUseCase.js';

export class GoogleAuthController {
        constructor(private googleAuthUseCase: GoogleAuthUseCase) {}
        Execute = catchAsync(
                async (req: Request, res: Response, _next: NextFunction) => {
                        const { token } = req.body;
                        const response =
                                await this.googleAuthUseCase.Execute(token);

                        return sendResponse(
                                res,
                                httpStatus.Success,
                                response,
                                response.tokens.refreshToken
                        );
                }
        );
}

export const googleAuthController = new GoogleAuthController(googleAuthUseCase);
