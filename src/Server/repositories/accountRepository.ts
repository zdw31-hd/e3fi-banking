import { Account, PremiumSavingsAccount, StandardSavingsAccount } from "../../Banking/Banking";

export interface AccountRepository {
  createStandard(userId: string, initialBalance: number): StandardSavingsAccount;
  createPremium(userId: string, initialBalance: number): PremiumSavingsAccount;
  findByNumber(accountNumber: string): Account | undefined;
  listByUser(userId: string): Account[];
  save(account: Account): void;
}

export class InMemoryAccountRepository implements AccountRepository {
  private readonly accounts = new Map<string, Account>();

  public createStandard(userId: string, initialBalance: number): StandardSavingsAccount {
    const acc = new StandardSavingsAccount(userId, initialBalance);
    this.accounts.set(acc.getAccountNumber(), acc);
    return acc;
  }

  public createPremium(userId: string, initialBalance: number): PremiumSavingsAccount {
    const acc = new PremiumSavingsAccount(userId, initialBalance);
    this.accounts.set(acc.getAccountNumber(), acc);
    return acc;
  }

  public findByNumber(accountNumber: string): Account | undefined {
    return this.accounts.get(accountNumber);
  }

  public listByUser(userId: string): Account[] {
    return Array.from(this.accounts.values()).filter(
      (acc) => acc.getOwnerId() === userId
    );
  }

  public save(_account: Account): void {
    // In-Memory: nichts zu tun
  }
}
