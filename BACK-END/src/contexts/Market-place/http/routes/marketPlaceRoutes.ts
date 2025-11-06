import { Router } from "express";
import { Authenticate } from "@src/shared/middlewares/authenticationMiddleware.js";
import { Authorize } from "@src/shared/middlewares/authorizationMiddleware.js";
import { CreateGigController } from "../controllers/createGigController.js";
import { ListGigsController } from "../controllers/listGigsController.js";
import { GetGigController } from "../controllers/getGigController.js";
import { UpdateGigController } from "../controllers/updateGigController.js";
import { DeleteGigController } from "../controllers/deleteGigController.js";
import { CreateApplicationController } from "../controllers/createApplicationController.js";
import { UpdateApplicationStatusController } from "../controllers/updateApplicationStatusController.js";
import { ListApplicationsController } from "../controllers/listApplicationsController.js";
import { CreateContractController } from "../controllers/createContractController.js";
import { ListContractController } from "../controllers/listContractsController.js";
import { GetContractController } from "../controllers/getContractController.js";

//IMPORT IMPLEMENTATIONS

import { createGigController } from "../controllers/createGigController.js";
import { listGigsController } from "../controllers/listGigsController.js";
import { getGigController } from "../controllers/getGigController.js";
import { updateGigController } from "../controllers/updateGigController.js";
import { deleteGigController } from "../controllers/deleteGigController.js";
import { createApplicationController } from "../controllers/createApplicationController.js";
import { updateApplicationStatusController } from "../controllers/updateApplicationStatusController.js";
import { listApplicationsController } from "../controllers/listApplicationsController.js";
import { createContractController } from "../controllers/createContractController.js";
import { listContractsController } from "../controllers/listContractsController.js";
import { getContractController } from "../controllers/getContractController.js";

// Factory function
export const MarketplaceRoutes = ({
  createGigController,
  listGigsController,
  getGigController,
  updateGigController,
  deleteGigController,
  createApplicationController,
  updateApplicationStatusController,
  listApplicationsController,
  createContractController,
  listContractsController,
  getContractController,
}: {
  createGigController: CreateGigController;
  listGigsController: ListGigsController;
  getGigController: GetGigController;
  updateGigController: UpdateGigController;
  deleteGigController: DeleteGigController;
  createApplicationController: CreateApplicationController;
  updateApplicationStatusController: UpdateApplicationStatusController;
  listApplicationsController: ListApplicationsController;
  createContractController: CreateContractController;
  listContractsController: ListContractController;
  getContractController: GetContractController;
}): Router => {
  const router = Router();

  /* ---------- GIG ROUTES ---------- */
  router.post(
    "/gigs",
    Authenticate,
    Authorize("CREATOR"),
    createGigController.Execute
  );

  router.get("/gigs", listGigsController.Execute);

  router.get("/gigs/:id", getGigController.Execute);

  router.patch(
    "/gigs/:id",
    Authenticate,
    Authorize("CREATOR"),
    updateGigController.Execute
  );

  router.delete(
    "/gigs/:id",
    Authenticate,
    Authorize("CREATOR"),
    deleteGigController.Execute
  );

  /* ---------- APPLICATION ROUTES ---------- */
  router.post(
    "/applications",
    Authenticate,
    Authorize("FREELANCER"),
    createApplicationController.Execute
  );

  router.get(
    "/applications",
    Authenticate,
    Authorize("FREELANCER", "CREATOR"),
    listApplicationsController.Execute
  );

  router.patch(
    "/applications/:id/:action(accept|reject|withdraw)",
    Authenticate,
    updateApplicationStatusController.Execute
  );

  /* ---------- CONTRACT ROUTES ---------- */
  router.post(
    "/contracts",
    Authenticate,
    Authorize("CREATOR"),
    createContractController.Execute
  );

  router.get(
    "/contracts",
    Authenticate,
    Authorize("CREATOR", "FREELANCER"),
    listContractsController.Execute
  );

  router.get(
    "/contract",
    Authenticate,
    Authorize("CREATOR", "FREELANCER"),
    getContractController.Execute
  );

  return router;
};

export const marketPlaceRoutes = MarketplaceRoutes({
  createGigController,
  listGigsController,
  getGigController,
  updateGigController,
  deleteGigController,
  createApplicationController,
  updateApplicationStatusController,
  listApplicationsController,
  createContractController,
  listContractsController,
  getContractController,
});
