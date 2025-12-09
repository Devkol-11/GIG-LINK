import { userRegisteredHandler } from './events/userRegistered.js';
import { passwordResetHandler } from './events/passwordReset.js';

export function authEventHandlers() {
        userRegisteredHandler();
        passwordResetHandler();
}
