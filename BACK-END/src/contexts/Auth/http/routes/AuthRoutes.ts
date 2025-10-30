import { Router } from "express";
import { RegisterController } from "../controllers/RegisterController.js";
import { LoginController } from "../controllers/LoginContoller.js";
import { ForgotPasswordController } from "../controllers/ForgotPasswordController.js";
import { ResetPasswordController } from "../controllers/ResetPasswordController.js";
import { validateRequest } from "@src/contexts/Auth/http/middle-wares/validateRequest.js";
import { registerSchema, loginSchema } from "../middle-wares/authValidators.js";
import { logger } from "@core/logging/winston.js";

//IMPORT INSTANCES
import { registerController } from "../controllers/RegisterController.js";
import { loginController } from "../controllers/LoginContoller.js";
import { forgotPasswordController } from "../controllers/ForgotPasswordController.js";
import { resetPasswordController } from "../controllers/ResetPasswordController.js";

const createAuthRoutes = (
  registerHandler: RegisterController,
  loginHandler: LoginController,
  forgotPasswordHandler: ForgotPasswordController,
  resetPasswordHandler: ResetPasswordController
): Router => {
  const authRouter = Router();

  authRouter.get("/check", (_req, res, _next) => {
    res.status(200).json({
      message: "Auth router working",
    });
  });

  authRouter.post(
    "/register",
    validateRequest(registerSchema),
    (req, res, next) => registerHandler.Execute(req, res, next)
  );

  authRouter.post("/login", validateRequest(loginSchema), (req, res, next) =>
    loginHandler.Execute(req, res, next)
  );

  authRouter.post("/forgot-password", (req, res, next) =>
    forgotPasswordHandler.Execute(req, res, next)
  );

  authRouter.post("/reset-password", (req, res, next) =>
    resetPasswordHandler.Execute(req, res, next)
  );
  return authRouter;
};

export const authRoutes = createAuthRoutes(
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController
);
