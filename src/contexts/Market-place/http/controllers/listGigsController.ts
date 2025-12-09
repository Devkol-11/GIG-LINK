import { Request, Response, NextFunction } from 'express';
import {
        ListGigsUseCase,
        listGigsUseCase
} from '../../application/usecases/listGigsUseCase.js';
import { catchAsync } from '@src/shared/helpers/catchAsync.js';
import { sendResponse } from '@src/shared/helpers/sendResponse.js';

export class ListGigsController {
        constructor(private readonly listGigsUseCase: ListGigsUseCase) {}

        Execute = catchAsync(
                async (_req: Request, res: Response, _next: NextFunction) => {
                        const gigs = await this.listGigsUseCase.Execute();

                        return sendResponse(res, 200, {
                                message: 'Gigs fetched successfully',
                                gigs
                        });
                }
        );
}

export const listGigsController = new ListGigsController(listGigsUseCase);
