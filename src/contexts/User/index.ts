import { user_registered_handler } from './application/subscribers/userRegistered.js';

export function registerUserSubscribers() {
        user_registered_handler();
}
