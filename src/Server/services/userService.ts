import { randomUUID, createHash } from "crypto";
import { SessionUser, User } from "../models/user";
import { UserRepository } from "../repositories/userRepository";

export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  public register(name: string, email: string, password: string): SessionUser {
    const existing = this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error("E-Mail bereits vergeben");
    }

    const user: User = {
      id: randomUUID(),
      name,
      email,
      passwordHash: this.hashPassword(password),
    };

    this.userRepo.create(user);
    return this.toSessionUser(user);
  }

  public login(email: string, password: string): SessionUser | null {
    const user = this.userRepo.findByEmail(email);
    if (!user) return null;

    const isValid = user.passwordHash === this.hashPassword(password);
    if (!isValid) return null;

    return this.toSessionUser(user);
  }

  public findById(id: string): SessionUser | null {
    const user = this.userRepo.findById(id);
    return user ? this.toSessionUser(user) : null;
  }

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private toSessionUser(user: User): SessionUser {
    return { id: user.id, name: user.name, email: user.email };
  }
}
