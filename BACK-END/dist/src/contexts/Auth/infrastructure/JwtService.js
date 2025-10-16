"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtLibary = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("@core/config/env");
class JwtLibary {
    constructor(accessSecretKey, refreshSecretKey) {
        this.accessSecretKey = accessSecretKey;
        this.refreshSecretKey = refreshSecretKey;
    }
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.accessSecretKey, {
            expiresIn: 15,
        });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.refreshSecretKey, {
            expiresIn: 15,
        });
    }
    verifyAccessToken(token) {
        return jsonwebtoken_1.default.verify(token, this.accessSecretKey);
    }
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.refreshSecretKey);
    }
}
exports.jwtLibary = new JwtLibary(env_1.config.ACCESS_TOKEN_SECRET, env_1.config.REFRESH_TOKEN_SECRET);
