import { Account, PremiumSavingsAccount, StandardSavingsAccount } from "../../Banking/Banking";
import { PersistedAccount, JsonStore } from "./jsonStore";
import { InMemoryAccountRepository } from "./accountRepository";

export class FileAccountRepository extends InMemoryAccountRepository {
  constructor(private readonly store: JsonStore) {
    super();
    this.restore();
  }

  public override createStandard(userId: string, initialBalance: number): StandardSavingsAccount {
    const acc = super.createStandard(userId, initialBalance);
    this.persist();
    return acc;
  }

  public override createPremium(userId: string, initialBalance: number): PremiumSavingsAccount {
    const acc = super.createPremium(userId, initialBalance);
    this.persist();
    return acc;
  }

  public override save(account: Account): void {
    // Account-Instanzen liegen bereits in der Map; wir persistieren nur
    this.persist();
  }

  private restore(): void {
    const persistedAccounts = this.store.get().accounts;
    persistedAccounts.forEach((data) => {
      const acc = this.hydrate(data);
      (this as any).accounts.set(acc.getAccountNumber(), acc);
    });
  }

  private hydrate(data: PersistedAccount): Account {
    let acc: Account;
    if (data.type === "PremiumSavingsAccount") {
      acc = new PremiumSavingsAccount(data.ownerId, data.balance);
      (acc as any).vipStatus = data.vipStatus ?? false;
    } else {
      const std = new StandardSavingsAccount(data.ownerId, data.balance);
      std["withdrawalCount"] = data.withdrawalCount ?? 0;
      acc = std;
    }

    // Setze gemeinsame Felder
    (acc as any).accountNumber = data.accountNumber;
    (acc as any).balance = data.balance;
    (acc as any).lastInterestDate = data.lastInterestDate ? new Date(data.lastInterestDate) : new Date();
    (acc as any).interestEarned = data.interestEarned ?? 0;
    return acc;
  }

  private persist(): void {
    const data = this.store.get();
    const accountsMap: Map<string, Account> = (this as any).accounts;
    const accounts = Array.from(accountsMap.values()).map((acc) => this.serialize(acc));
    this.store.write({ ...data, accounts });
  }

  private serialize(acc: Account): PersistedAccount {
    const anyAcc = acc as any;
    return {
      accountNumber: acc.getAccountNumber(),
      ownerId: acc.getOwnerId(),
      balance: acc.getBalance(),
      type: acc.constructor.name,
      lastInterestDate: anyAcc.lastInterestDate ? new Date(anyAcc.lastInterestDate).toISOString() : undefined,
      interestEarned: anyAcc.interestEarned ?? 0,
      withdrawalCount: anyAcc.withdrawalCount ?? 0,
      vipStatus: anyAcc.vipStatus ?? false,
    };
  }
}
