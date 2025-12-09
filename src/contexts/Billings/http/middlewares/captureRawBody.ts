import { Request, Response, NextFunction } from 'express';

export function captureRawBody(req: Request, res: Response, next: NextFunction) {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => {
                req.rawBody = data;
                next();
        });
}
