import { Account } from "../../Banking/Banking";
import { AccountRepository } from "../repositories/accountRepository";

export class AccountService {
  constructor(private readonly accountRepo: AccountRepository) {}

  public openStandard(userId: string, initialBalance: number): Account {
    return this.accountRepo.createStandard(userId, initialBalance);
  }

  public openPremium(userId: string, initialBalance: number): Account {
    return this.accountRepo.createPremium(userId, initialBalance);
  }

  public listForUser(userId: string): Account[] {
    return this.accountRepo.listByUser(userId);
  }

  public deposit(accountNumber: string, amount: number): boolean {
    const account = this.accountRepo.findByNumber(accountNumber);
    if (!account) return false;
    const ok = account.deposit(amount);
    if (ok) this.accountRepo.save(account);
    return ok;
  }

  public withdraw(accountNumber: string, amount: number): boolean {
    const account = this.accountRepo.findByNumber(accountNumber);
    if (!account) return false;
    const ok = account.withdraw(amount);
    if (ok) this.accountRepo.save(account);
    return ok;
  }

  public applyInterestForUser(userId: string): void {
    const accounts = this.accountRepo.listByUser(userId);
    accounts.forEach((acc) => {
      if ("applyInterest" in acc) {
        (acc as any).applyInterest();
        this.accountRepo.save(acc);
      }
    });
  }
}
