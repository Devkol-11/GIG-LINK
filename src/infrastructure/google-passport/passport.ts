import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import { config } from '@src/infrastructure/env-config/env.js';
import { access } from 'fs';

dotenv.config();
const passportGoogleCallback = (
        accesstoken: string,
        refreshToken: string,
        profile: any,
        done: any
) => {
        try {
                const googleId = profile.id;
                const email = profile.emails?.[0]?.value ?? null;
                const name = profile.displayName ?? null;
        } catch (error) {}
};
const googleStrategy = new GoogleStrategy(
        {
                clientID: config.GOOGLE_CLIENT_ID as string,
                clientSecret: config.GOOGLE_CLIENT_SECRET as string,
                callbackURL: config.GOOGLE_CALLBACK_URL as string
        },
        passportGoogleCallback
);
passport.use(googleStrategy);
