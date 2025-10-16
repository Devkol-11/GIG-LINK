import { Router } from "express";
import { RegisterController } from "../controllers/RegisterController";
import { LoginController } from "../controllers/LoginContoller";
import { ForgotPasswordController } from "../controllers/ForgotPasswordController";
import { ResetPasswordController } from "../controllers/ResetPasswordController";
import { validateRequest } from "@src/shared/middlewares/validateRequest";
import { registerSchema, loginSchema } from "../middle-wares/authValidators";
import { logger } from "@core/logging/winston";

//IMPORT INSTANCES
import { registerController } from "../controllers/RegisterController";
import { loginController } from "../controllers/LoginContoller";
import { forgotPasswordController } from "../controllers/ForgotPasswordController";
import { resetPasswordController } from "../controllers/ResetPasswordController";

const createAuthRoutes = (
  registerController: RegisterController,
  loginController: LoginController,
  forgotPasswordController: ForgotPasswordController,
  resetPasswordController: ResetPasswordController
): Router => {
  const authRouter = Router();

  authRouter.get("/check", (req, res, next) => {
    res.status(200).json({
      message: "Auth router working",
    });
  });

  authRouter.post(
    "/register",
    validateRequest(registerSchema),
    (req, res, next) => registerController.Execute(req, res, next)
  );

  authRouter.post("/login", validateRequest(loginSchema), (req, res, next) =>
    loginController.Execute(req, res, next)
  );

  authRouter.post("/forgot-password", (req, res, next) =>
    forgotPasswordController.Execute(req, res, next)
  );

  authRouter.post("/reset-password", (req, res, next) =>
    resetPasswordController.Execute(req, res, next)
  );
  return authRouter;
};

export const authRoutes = createAuthRoutes(
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController
);
