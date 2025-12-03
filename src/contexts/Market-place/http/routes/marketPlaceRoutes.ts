import { Router } from 'express';
import { Authenticate, Authorize } from '@src/shared/middlewares/auth.js';

import { createGigController } from '../controllers/createGigController.js';
import { listGigsController } from '../controllers/listGigsController.js';
import { getGigController } from '../controllers/getGigController.js';
import { updateGigController } from '../controllers/updateGigController.js';
import { deleteGigController } from '../controllers/deleteGigController.js';

import { createApplicationController } from '../controllers/createApplicationController.js';
import { updateApplicationStatusController } from '../controllers/updateApplicationStatusController.js';
import { listApplicationsController } from '../controllers/listApplicationsController.js';

import { createContractController } from '../controllers/createContractController.js';
import { listContractsController } from '../controllers/listContractsController.js';
import { getContractController } from '../controllers/getContractController.js';

export const marketplaceRoutes = Router();

/* ---------- GIG ROUTES ---------- */

marketplaceRoutes.post(
        '/gigs',
        Authenticate,
        Authorize('CREATOR'),
        createGigController.Execute
);

marketplaceRoutes.get('/gigs', listGigsController.Execute);

marketplaceRoutes.get('/gigs/:id', getGigController.Execute);

marketplaceRoutes.patch(
        '/gigs/:id',
        Authenticate,
        Authorize('CREATOR'),
        updateGigController.Execute
);

marketplaceRoutes.delete(
        '/gigs/:id',
        Authenticate,
        Authorize('CREATOR'),
        deleteGigController.Execute
);

/* ---------- APPLICATION ROUTES ---------- */

marketplaceRoutes.post(
        '/applications',
        Authenticate,
        Authorize('FREELANCER'),
        createApplicationController.Execute
);

marketplaceRoutes.get(
        '/applications',
        Authenticate,
        Authorize('FREELANCER', 'CREATOR'),
        listApplicationsController.Execute
);

marketplaceRoutes.patch(
        '/applications/:id/:action',
        Authenticate,
        updateApplicationStatusController.Execute
);

/* ---------- CONTRACT ROUTES ---------- */

marketplaceRoutes.post(
        '/contracts',
        Authenticate,
        Authorize('CREATOR'),
        createContractController.Execute
);

marketplaceRoutes.get(
        '/contracts',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        listContractsController.Execute
);

marketplaceRoutes.get(
        '/contract',
        Authenticate,
        Authorize('CREATOR', 'FREELANCER'),
        getContractController.Execute
);
