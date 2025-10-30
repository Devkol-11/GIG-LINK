import { Router } from "express";
import { Authenticate } from "@src/shared/middlewares/authMiddleware.js";
import { CreateProfileHandler } from "../controllers/createProfileHandler.js";
import { GetProfileHandler } from "../controllers/getProfileHandler.js";
import { UpdateAvatarHandler } from "../controllers/updateAvaterHandler.js";
import { UpdateProfileHandler } from "../controllers/updateProfileHandler.js";

//IMPORT IMPLEMENTATIONS
import { createProfileHandler } from "../controllers/createProfileHandler.js";
import { getProfileHandler } from "../controllers/getProfileHandler.js";
import { updateAvatarHandler } from "../controllers/updateAvaterHandler.js";
import { updateProfileHandler } from "../controllers/updateProfileHandler.js";

function UserRoutes(
  createProfileHandler: CreateProfileHandler,
  getProfileHandler: GetProfileHandler,
  updateProfileHandler: UpdateProfileHandler,
  updateAvatarHandler: UpdateAvatarHandler
): Router {
  const userRouter = Router();

  userRouter.post("/profile", Authenticate, (req, res, next) =>
    createProfileHandler.Execute(req, res, next)
  );

  userRouter.get("/profile/:id", Authenticate, (req, res, next) =>
    getProfileHandler.Execute(req, res, next)
  );

  userRouter.patch("/profile/:id", Authenticate, (req, res, next) =>
    updateProfileHandler.Execute(req, res, next)
  );

  userRouter.patch("/profile:id/avatar", Authenticate, (req, res, next) =>
    updateAvatarHandler.Execute(req, res, next)
  );

  return userRouter;
}

export const userRoutes = UserRoutes(
  createProfileHandler,
  getProfileHandler,
  updateProfileHandler,
  updateAvatarHandler
);
