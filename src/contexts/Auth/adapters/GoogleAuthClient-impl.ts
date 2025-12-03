import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { config } from '@src/infrastructure/env-config/env.js';

export const googleAuthClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

export const getGoogleAuthPayload = async (
        token: string
): Promise<TokenPayload | undefined> => {
        let ticket: LoginTicket;

        ticket = await googleAuthClient.verifyIdToken({
                idToken: token,
                audience: config.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        return payload;
};
