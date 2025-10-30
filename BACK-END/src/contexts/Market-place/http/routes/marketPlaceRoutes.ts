import { Router } from "express";
import { CreateGigController } from "../controllers/createGigController.js";
import { Authenticate } from "@src/shared/middlewares/authMiddleware.js";
import { Authorize } from "@src/shared/middlewares/allowRoles.js";

// IMPORT IMPLEMENTATIONS
import { createGigController } from "../controllers/createGigController.js";

const marketPlaceRoutes = (createGigController: CreateGigController) => {
  const marketPlaceRouter = Router();

  marketPlaceRouter.post("/create-gig", Authenticate, Authorize([]));
};
