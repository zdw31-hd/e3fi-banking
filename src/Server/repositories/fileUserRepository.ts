import { User } from "../models/user";
import { JsonStore } from "./jsonStore";
import { InMemoryUserRepository, UserRepository } from "./userRepository";

export class FileUserRepository extends InMemoryUserRepository implements UserRepository {
  constructor(private readonly store: JsonStore) {
    super();
    this.restore();
  }

  public override create(user: User): User {
    const created = super.create(user);
    this.persist();
    return created;
  }

  private restore(): void {
    const data = this.store.get().users;
    data.forEach((user) => super.create(user));
  }

  private persist(): void {
    const data = this.store.get();
    const users = Array.from((this as any).usersById.values()) as User[];
    this.store.write({ ...data, users });
  }
}
