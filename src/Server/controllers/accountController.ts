import { Request, Response } from "express";
import { toAccountViewModel } from "../models/account";
import { AccountService } from "../services/accountService";

export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  public renderDashboard = (req: Request, res: Response): void => {
    const user = req.session.user!;
    const accounts = this.accountService.listForUser(user.id).map(toAccountViewModel);
    res.render("dashboard", { user, accounts, message: null, error: null });
  };

  public createAccount = (req: Request, res: Response): void => {
    const user = req.session.user!;
    const { accountType, initialBalance } = req.body;
    const balance = Number(initialBalance) || 0;

    try {
      if (accountType === "premium") {
        this.accountService.openPremium(user.id, balance);
      } else {
        this.accountService.openStandard(user.id, balance);
      }
      res.redirect("/dashboard");
    } catch (err: any) {
      res.status(400).render("dashboard", {
        user,
        accounts: this.accountService.listForUser(user.id).map(toAccountViewModel),
        message: null,
        error: err.message ?? "Konto konnte nicht erstellt werden",
      });
    }
  };

  public deposit = (req: Request, res: Response): void => {
    const user = req.session.user!;
    const amount = Number(req.body.amount);
    const accountNumber = req.params.accountNumber;
    const success = this.accountService.deposit(accountNumber, amount);
    const message = success ? "Einzahlung erfolgreich" : "Einzahlung fehlgeschlagen";

    res.render("dashboard", {
      user,
      accounts: this.accountService.listForUser(user.id).map(toAccountViewModel),
      message,
      error: success ? null : "Betrag ungültig oder Konto nicht gefunden",
    });
  };

  public withdraw = (req: Request, res: Response): void => {
    const user = req.session.user!;
    const amount = Number(req.body.amount);
    const accountNumber = req.params.accountNumber;
    const success = this.accountService.withdraw(accountNumber, amount);
    const message = success ? "Abhebung erfolgreich" : "Abhebung fehlgeschlagen";

    res.render("dashboard", {
      user,
      accounts: this.accountService.listForUser(user.id).map(toAccountViewModel),
      message,
      error: success ? null : "Betrag ungültig oder Mindestguthaben verletzt",
    });
  };

  public applyInterest = (req: Request, res: Response): void => {
    const user = req.session.user!;
    this.accountService.applyInterestForUser(user.id);
    res.render("dashboard", {
      user,
      accounts: this.accountService.listForUser(user.id).map(toAccountViewModel),
      message: "Zinsen angewendet",
      error: null,
    });
  };
}
