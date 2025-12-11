import path from "path";
import express from "express";
import session from "express-session";
import cors from "cors";
import { FileUserRepository } from "./repositories/fileUserRepository";
import { FileAccountRepository } from "./repositories/fileAccountRepository";
import { JsonStore } from "./repositories/jsonStore";
import { UserService } from "./services/userService";
import { AccountService } from "./services/accountService";
import { AuthController } from "./controllers/authController";
import { AccountController } from "./controllers/accountController";
import { PageController } from "./controllers/pageController";
import { buildAuthRoutes } from "./routes/auth";
import { buildAccountRoutes } from "./routes/accounts";
import { buildPageRoutes } from "./routes/pages";
import { attachUserToLocals } from "./middleware/sessionUser";
import { requireAuth } from "./middleware/authGuard";
import { NewsletterController } from "./controllers/newsletterController";
import { NewsletterService } from "./services/newsletterService";

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(attachUserToLocals);

// Dependency setup
const dataFile = process.env.DATA_FILE_PATH || path.join(process.cwd(), "data", "bank-data.json");
const store = new JsonStore(dataFile);
const userRepo = new FileUserRepository(store);
const accountRepo = new FileAccountRepository(store);
const userService = new UserService(userRepo);
const accountService = new AccountService(accountRepo);
const newsletterService = new NewsletterService();

const authController = new AuthController(userService);
const accountController = new AccountController(accountService);
const pageController = new PageController();
const newsletterController = new NewsletterController(newsletterService);

// Routes
app.use("/", buildPageRoutes(pageController, accountController, newsletterController));
app.use("/", buildAuthRoutes(authController));
app.use("/accounts", requireAuth, buildAccountRoutes(accountController));

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API + Views laufen auf http://localhost:${port}`);
  });
}

export default app;
