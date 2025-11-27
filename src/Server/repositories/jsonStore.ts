import fs from "fs";
import path from "path";
import { User } from "../models/user";

export interface PersistedAccount {
  accountNumber: string;
  ownerId: string;
  balance: number;
  type: string;
  lastInterestDate?: string;
  interestEarned?: number;
  withdrawalCount?: number;
  vipStatus?: boolean;
}

export interface PersistedData {
  users: User[];
  accounts: PersistedAccount[];
}

export class JsonStore {
  private data: PersistedData;

  constructor(private readonly filePath: string) {
    this.ensureFile();
    this.data = this.readFromDisk();
  }

  public get(): PersistedData {
    return this.data;
  }

  public write(next: PersistedData): void {
    this.data = next;
    fs.writeFileSync(this.filePath, JSON.stringify(next, null, 2), "utf-8");
  }

  public update(updater: (data: PersistedData) => PersistedData): void {
    const updated = updater(this.data);
    this.write(updated);
  }

  private ensureFile(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      const initial: PersistedData = { users: [], accounts: [] };
      fs.writeFileSync(this.filePath, JSON.stringify(initial, null, 2), "utf-8");
    }
  }

  private readFromDisk(): PersistedData {
    const raw = fs.readFileSync(this.filePath, "utf-8");
    try {
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users ?? [],
        accounts: parsed.accounts ?? [],
      };
    } catch (err) {
      console.error("Persistenz-Datei defekt, starte neu", err);
      return { users: [], accounts: [] };
    }
  }
}
