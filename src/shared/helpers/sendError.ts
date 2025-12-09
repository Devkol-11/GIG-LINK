import { Response } from 'express';

export const sendError = (res: Response, statusCode: number, data: any) => {
        res.status(statusCode).json({
                ...data
        });
};
