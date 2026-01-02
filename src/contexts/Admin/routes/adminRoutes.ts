import { Router } from 'express';
import { admin_auth_Controllers } from '../controllers/admin_auth_Controllers.js';
import { admin_user_Controllers } from '../controllers/admin_user_Controllers.js';
import { adminValidation } from '../middleWares/adminValidation.js';

export const adminRoutes = Router();

adminRoutes.post(
        '/register-admin',
        adminValidation.validateRequest(adminValidation.registerSchema),
        admin_auth_Controllers.registerAdmin
);
adminRoutes.post(
        '/login-admin',
        adminValidation.validateRequest(adminValidation.loginSchema),
        admin_auth_Controllers.loginAdmin
);

adminRoutes.post(
        '/logout-admin',
        adminValidation.validateRequest(adminValidation.logoutSchema),
        admin_auth_Controllers.logoutAdmin
);

adminRoutes.delete('/delete-user/:userId', admin_user_Controllers.deleteUser);
