import { Router } from "express";
import { AccountController } from "../controllers/accountController";

export const buildAccountRoutes = (controller: AccountController): Router => {
  const router = Router();
  router.post("/", controller.createAccount);
  router.post("/:accountNumber/deposit", controller.deposit);
  router.post("/:accountNumber/withdraw", controller.withdraw);
  router.post("/apply-interest", controller.applyInterest);
  return router;
};
