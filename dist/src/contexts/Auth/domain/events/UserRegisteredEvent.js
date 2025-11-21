'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.UserRegisteredEvent = void 0;
class UserRegisteredEvent {
        constructor(userId, email, firstName, lastName) {
                this.userId = userId;
                this.email = email;
                this.firstName = firstName;
                this.lastName = lastName;
                this.event_type = 'User_Registered_Event';
                this.routing_key = 'auth.registered';
                this.timeStamp = new Date();
        }
}
exports.UserRegisteredEvent = UserRegisteredEvent;
