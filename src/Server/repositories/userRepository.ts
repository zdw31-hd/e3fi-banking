import { User } from "../models/user";

export interface UserRepository {
  create(user: User): User;
  findByEmail(email: string): User | undefined;
  findById(id: string): User | undefined;
}

export class InMemoryUserRepository implements UserRepository {
  private readonly usersById = new Map<string, User>();
  private readonly usersByEmail = new Map<string, User>();

  public create(user: User): User {
    this.usersById.set(user.id, user);
    this.usersByEmail.set(user.email.toLowerCase(), user);
    return user;
  }

  public findByEmail(email: string): User | undefined {
    return this.usersByEmail.get(email.toLowerCase());
  }

  public findById(id: string): User | undefined {
    return this.usersById.get(id);
  }
}
