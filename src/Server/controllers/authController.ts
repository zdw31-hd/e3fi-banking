import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class AuthController {
  constructor(private readonly userService: UserService) {}

  public renderLogin = (req: Request, res: Response): void => {
    res.render("login", { error: null });
  };

  public renderSignup = (req: Request, res: Response): void => {
    res.render("signup", { error: null });
  };

  public handleSignup = (req: Request, res: Response): void => {
    const { name, email, password } = req.body;
    try {
      const user = this.userService.register(name, email, password);
      req.session.user = user;
      res.redirect("/dashboard");
    } catch (err: any) {
      res.status(400).render("signup", { error: err.message });
    }
  };

  public handleLogin = (req: Request, res: Response): void => {
    const { email, password } = req.body;
    const user = this.userService.login(email, password);
    if (!user) {
      res.status(401).render("login", { error: "Login fehlgeschlagen" });
      return;
    }
    req.session.user = user;
    res.redirect("/dashboard");
  };

  public handleLogout = (req: Request, res: Response): void => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  };
}
