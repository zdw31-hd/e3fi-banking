import { Router } from "express";
import { AccountController } from "../controllers/accountController";
import { PageController } from "../controllers/pageController";
import { NewsletterController } from "../controllers/newsletterController";
import { requireAuth } from "../middleware/authGuard";

export const buildPageRoutes = (
  pageController: PageController,
  accountController: AccountController,
  newsletterController: NewsletterController
): Router => {
  const router = Router();
  router.get("/", pageController.landing);
  router.get("/dashboard", requireAuth, accountController.renderDashboard);
  router.get("/newsletter", requireAuth, newsletterController.renderNewsletter);
  return router;
};
