import { PremiumSavingsAccount, StandardSavingsAccount, Account } from "./Banking";

class Bank {
    private users: Map<string, User> = new Map();
    private accounts: Map<string, Account> = new Map();
  
    // === User-Management ===
  
    public createUser(name: string, email: string): User {
      const user = new User(name, email);
      this.users.set(user.getId(), user);
      console.log(`👤 Neuer User: ${user.getName()} (${user.getId()})`);
      return user;
    }
  
    public getUserById(id: string): User | undefined {
      return this.users.get(id);
    }
  
    public getAllUsers(): User[] {
      return Array.from(this.users.values());
    }
  
    // === Account-Management ===
  
    public openStandardSavingsAccount(userId: string, initialBalance: number): StandardSavingsAccount {
      const user = this.getUserById(userId);
      if (!user) {
        throw new Error(`User mit ID ${userId} nicht gefunden`);
      }
      const acc = new StandardSavingsAccount(userId, initialBalance);
      this.accounts.set(acc.getAccountNumber(), acc);
      console.log(`🏦 Standard-Sparkonto eröffnet für ${user.getName()}: ${acc.getAccountNumber()}`);
      return acc;
    }
  
    public openPremiumSavingsAccount(userId: string, initialBalance: number): PremiumSavingsAccount {
      const user = this.getUserById(userId);
      if (!user) {
        throw new Error(`User mit ID ${userId} nicht gefunden`);
      }
      const acc = new PremiumSavingsAccount(userId, initialBalance);
      this.accounts.set(acc.getAccountNumber(), acc);
      console.log(`🏦 Premium-Sparkonto eröffnet für ${user.getName()}: ${acc.getAccountNumber()}`);
      return acc;
    }
  
    public getAccountByNumber(accountNumber: string): Account | undefined {
      return this.accounts.get(accountNumber);
    }
  
    public getAccountsForUser(userId: string): Account[] {
      return Array.from(this.accounts.values()).filter(
        acc => acc.getOwnerId() === userId
      );
    }
  
    // === Operationen auf Konten ===
  
    public deposit(accountNumber: string, amount: number): boolean {
      const acc = this.getAccountByNumber(accountNumber);
      if (!acc) {
        console.log(`❌ Konto ${accountNumber} nicht gefunden`);
        return false;
      }
      return acc.deposit(amount);
    }
  
    public withdraw(accountNumber: string, amount: number): boolean {
      const acc = this.getAccountByNumber(accountNumber);
      if (!acc) {
        console.log(`❌ Konto ${accountNumber} nicht gefunden`);
        return false;
      }
      return acc.withdraw(amount);
    }
  
    public applyInterestToAll(): void {
      for (const acc of this.accounts.values()) {
        if ('applyInterest' in acc) {
          (acc as any).applyInterest();
        }
      }
    }
  }