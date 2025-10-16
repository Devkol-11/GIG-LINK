"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = generateOtp;
// src/contexts/Auth/domain/utils/generateOtp.ts
function generateOtp() {
    // Generates a random 6-digit number as a string
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}
