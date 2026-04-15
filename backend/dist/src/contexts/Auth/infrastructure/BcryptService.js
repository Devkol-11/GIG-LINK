'use strict';
var __importDefault =
        (this && this.__importDefault) ||
        function (mod) {
                return mod && mod.__esModule ? mod : { default: mod };
        };
Object.defineProperty(exports, '__esModule', { value: true });
exports.bcryptLibary = void 0;
const bcrypt_1 = __importDefault(require('bcrypt'));
class BcryptLibary {
        constructor(saltRounds = 12) {
                this.saltRounds = saltRounds;
        }
        async hash(plainPassoword) {
                return await bcrypt_1.default.hash(
                        plainPassoword,
                        this.saltRounds
                );
        }
        async compare(plainPassoword, hashedPassword) {
                return await bcrypt_1.default.compare(
                        plainPassoword,
                        hashedPassword
                );
        }
}
exports.bcryptLibary = new BcryptLibary(10);
