import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export function verifyWebhookSignature(secretKey: string) {
        return (req: Request, res: Response, next: NextFunction) => {
                const signature = req.headers['x-paystack-signature'] as string;
                const rawBody = req.rawBody as string; // capture this from a rawBody parser middleware

                if (!signature || !rawBody) {
                        return res.status(400).send('Invalid request');
                }

                const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');

                if (hash !== signature) {
                        return res.status(401).send('Unauthorized');
                }

                next();
        };
}
