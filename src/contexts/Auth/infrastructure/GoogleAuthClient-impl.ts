import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { config } from '@src/core/env-config/env.js';

export const googleAuthClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

export const getGoogleAuthPayload = async (token: string) => {
        const ticket = await googleAuthClient.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        return payload;
};
