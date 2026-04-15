'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.PasswordResetToken = void 0;
class PasswordResetToken {
        constructor(id, userId, token, used, createdAt, expiresAt) {
                this.id = id;
                this.userId = userId;
                this.token = token;
                this.used = used;
                this.createdAt = createdAt;
                this.expiresAt = expiresAt;
        }
        markAsUsed() {
                this.used = true;
        }
        isExpired() {
                return new Date() > this.expiresAt;
        }
}
exports.PasswordResetToken = PasswordResetToken;
