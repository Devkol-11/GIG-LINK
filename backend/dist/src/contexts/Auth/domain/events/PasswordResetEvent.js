'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PasswordResetEvent = void 0;
class PasswordResetEvent {
        constructor(userId, email, token) {
                this.userId = userId;
                this.email = email;
                this.token = token;
                this.event_type = 'Password_Reset_Requested_Event';
                this.routing_key = 'auth.password_reset.requested';
                this.timeStamp = new Date();
        }
}
exports.PasswordResetEvent = PasswordResetEvent;
