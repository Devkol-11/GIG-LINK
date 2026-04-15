import express from "express";
import { authRouter } from "./http/auth/auth.routes.js";
import { billingRouter } from "./http/billing/billing.routes.js";
import { marketPlaceRouter } from "./http/market-place/market-place.routes.js";
import { usersRouter } from "./http/users/users.routes.js";
import { errorHandler } from "./utils/error.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    data: { status: "ok" },
    message: "API is running",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/market-place", marketPlaceRouter);
app.use("/api/v1/billing", billingRouter);

app.use(errorHandler);
