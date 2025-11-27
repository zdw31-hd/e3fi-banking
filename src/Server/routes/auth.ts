import { Router } from "express";
import { AuthController } from "../controllers/authController";

export const buildAuthRoutes = (controller: AuthController): Router => {
  const router = Router();
  router.get("/login", controller.renderLogin);
  router.get("/signup", controller.renderSignup);
  router.post("/signup", controller.handleSignup);
  router.post("/login", controller.handleLogin);
  router.post("/logout", controller.handleLogout);
  return router;
};
