import { z } from "zod";

export const createProfileSchema = {
  body: z.object({
    bio: z.string().max(500).optional(),
    skills: z.array(z.string().min(1)).min(1),
    portfolio: z.url().optional(),
    hourlyRate: z.number().nonnegative().optional(),
    location: z.string().min(1).optional(),
    interests: z.array(z.string().min(1)).optional(),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    bio: z.string().max(500).optional(),
    skills: z.array(z.string().min(1)).optional(),
    portfolio: z.url().optional(),
    hourlyRate: z.number().nonnegative().optional(),
    location: z.string().min(1).optional(),
    interests: z.array(z.string().min(1)).optional(),
  }),
};

export const uploadAvatarSchema = {
  body: z.object({
    avatarUrl: z.url(),
  }),
};
