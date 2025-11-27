import { Router } from "express";
import { AccountController } from "../controllers/accountController";
import { PageController } from "../controllers/pageController";
import { requireAuth } from "../middleware/authGuard";

export const buildPageRoutes = (
  pageController: PageController,
  accountController: AccountController
): Router => {
  const router = Router();
  router.get("/", pageController.landing);
  router.get("/dashboard", requireAuth, accountController.renderDashboard);
  return router;
};
