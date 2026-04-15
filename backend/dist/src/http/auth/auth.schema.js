import { z } from "zod";
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters long");
export const registerSchema = {
    body: z.object({
        email: z.email(),
        password: passwordSchema,
        firstName: z.string().min(1),
        lastName: z.string().min(1),
    }),
};
export const loginSchema = {
    body: z.object({
        email: z.email(),
        password: z.string().min(1),
    }),
};
export const forgotPasswordSchema = {
    body: z.object({
        email: z.email(),
    }),
};
export const resetPasswordSchema = {
    body: z.object({
        email: z.email(),
        otp: z.string().length(6),
        newPassword: passwordSchema,
    }),
};
