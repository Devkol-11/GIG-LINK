import { Router } from "express";
import { usersController } from "./users.controller.js";
import {
  createProfileSchema,
  updateProfileSchema,
  uploadAvatarSchema,
} from "./users.schema.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { authMiddleware } from "../../utils/auth.middleware.js";
import { validate } from "../../utils/validate.js";

export const usersRouter = Router();

usersRouter.use(authMiddleware);

usersRouter.post(
  "/createProfile",
  validate(createProfileSchema),
  asyncHandler(usersController.createProfile),
);
usersRouter.get("/profile", asyncHandler(usersController.getProfile));
usersRouter.put(
  "/profile",
  validate(updateProfileSchema),
  asyncHandler(usersController.updateProfile),
);
usersRouter.post(
  "/avatar",
  validate(uploadAvatarSchema),
  asyncHandler(usersController.uploadAvatar),
);
