// ===========================
// MERMAID KLASSENDIAGRAMM
// Online Banking System
// ===========================

/*

classDiagram
    %% Interfaces
    class IInterestBearing {
        <<interface>>
        +calculateInterest() number
        +applyInterest() void
    }
    
    %% Abstract Base Class (Stufe 1)
    class Account {
        <<abstract>>
        -accountNumber: string
        -owner: string
        -balance: number
        -createdAt: Date
        -isActive: boolean
        +Account(owner: string, initialBalance: number)
        +getBalance() number
        +getAccountNumber() string
        #validateAmount(amount: number) boolean
        +deposit(amount: number)* boolean
        +withdraw(amount: number)* boolean
        +getAccountInfo() string
    }
    
    %% Intermediate Classes (Stufe 2)
    class SavingsAccount {
        <<abstract>>
        -interestRate: number
        -minimumBalance: number
        -lastInterestDate: Date
        #interestEarned: number
        +SavingsAccount(owner: string, initialBalance: number, rate: number)
        +getInterestRate() number
        #canWithdraw(amount: number) boolean
        +calculateInterest() number
        +applyInterest() void
        +deposit(amount: number) boolean
        +withdraw(amount: number)* boolean
    }
    
    %% Concrete Classes (Stufe 3)
    class StandardSavingsAccount {
        -withdrawalLimit: number
        -penaltyRate: number
        +StandardSavingsAccount(owner: string, initialBalance: number)
        +withdraw(amount: number) boolean
        -applyPenalty() void
    }
    
    class PremiumSavingsAccount {
        -bonusRate: number
        -minimumMonthlyDeposit: number
        -vipStatus: boolean
        +PremiumSavingsAccount(owner: string, initialBalance: number)
        +calculateInterest() number
        +upgradeToPremium() void
        +withdraw(amount: number) boolean
        -checkVIPStatus() boolean
    }
    
    %% Relationships - Interfaces
    IInterestBearing <|.. SavingsAccount : implements
    
    %% Relationships - Inheritance (Stufe 1 -> Stufe 2)
    Account <|-- SavingsAccount : extends
    
    %% Relationships - Inheritance (Stufe 2 -> Stufe 3)
    SavingsAccount <|-- StandardSavingsAccount : extends
    SavingsAccount <|-- PremiumSavingsAccount : extends
    
*/

// ===========================
// STUFE 0: Interface
// ===========================

export interface IInterestBearing {
    calculateInterest(): number;
    applyInterest(): void;
}

// ===========================
// STUFE 1: abstrakte Basisklasse
// ===========================
export abstract class Account {
    private readonly accountNumber: string;
    private readonly owner: string;
    private balance: number;
    private readonly createdAt: Date;
    private isActive: boolean = true;

    constructor(owner: string, initialBalance: number) {
        this.owner = owner;
        this.balance = initialBalance;
        this.accountNumber = this.generateAccountNumber();
        this.createdAt = new Date();
    }

    private generateAccountNumber(): string {
        return `DE${Math.floor(Math.random() * 10000000000000000000)}`;
    }

    public getBalance(): number {
        return this.balance;
    }

    public getAccountNumber(): string {
        return this.accountNumber;
    }

    protected validateAmount(amount: number): boolean {
        return amount > 0 && isFinite(amount);
    }

    protected updateBalance(amount: number): void {
        this.balance += amount;
    }

    // Abstrakte Operationen - müssen von Subklassen implementiert werden
    public abstract deposit(amount: number): boolean;
    public abstract withdraw(amount: number): boolean;

    public getAccountInfo(): string {
        return `Account ${this.accountNumber} | OwnerId: ${this.owner} | Balance: ${this.balance.toFixed(2)} €`;
    }
    
    public getOwnerId(): string {
        return this.owner;
      }

}

// ===========================
// STUFE 2: Zwischenstufe: immer noch abstrakt
// ===========================

export abstract class SavingsAccount extends Account implements IInterestBearing {
    private readonly interestRate: number;
    private readonly minimumBalance: number;
    private lastInterestDate: Date;
    protected interestEarned: number;

    constructor(owner: string, initialBalance: number, rate: number) {
        super(owner, initialBalance);
        this.interestRate = rate;
        this.minimumBalance = 100;
        this.lastInterestDate = new Date();
        this.interestEarned = 0;
    }

    public getInterestRate(): number {
        return this.interestRate;
    }

    protected canWithdraw(amount: number): boolean {
        return this.getBalance() - amount >= this.minimumBalance;
    }

    public calculateInterest(): number {
        const balance = this.getBalance();
        const daysSinceLastInterest = Math.floor(
            (Date.now() - this.lastInterestDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return (balance * this.interestRate * daysSinceLastInterest) / 36500;
    }

    public applyInterest(): void {
        // ::Showdown:: Zugriff auf private Member der Basisklasse
        //console.log(this.owner);
        console.log((this as any).owner);
        console.log(this['owner']);

        const interest = this.calculateInterest();
        if (interest > 0) {
            this.updateBalance(interest);
            this.interestEarned += interest;
            this.lastInterestDate = new Date();
            console.log(`✅ Zinsen gutgeschrieben: €${interest.toFixed(2)}`);
        }
    }

    public deposit(amount: number): boolean {
        if (!this.validateAmount(amount)) {
            console.log('❌ Ungültiger Betrag');
            return false;
        }

        this.updateBalance(amount);
        console.log(`✅ Einzahlung: €${amount.toFixed(2)}`);
        return true;
    }

    // immer noch eine abstrakte Operation, daher auch die Klasse abstrakt
    public abstract withdraw(amount: number): boolean;
}

// ===========================
// STUFE 3: Konkrete Klassen  
// ===========================

export class StandardSavingsAccount extends SavingsAccount {
    private readonly withdrawalLimit: number = 3; // max 3 Abhebungen pro Monat
    private readonly penaltyRate: number = 0.01;
    private withdrawalCount: number = 0;

    constructor(owner: string, initialBalance: number) {
        super(owner, initialBalance, 0.002); // 0,2% Zinsen
    }

    public withdraw(amount: number): boolean {
        console.log(this.interestEarned);
        if (!this.validateAmount(amount)) {
            console.log('❌ Ungültiger Betrag');
            return false;
        }

        if (!this.canWithdraw(amount)) {
            console.log('❌ Mindestguthaben unterschritten');
            return false;
        }

        this.updateBalance(-amount);
        this.withdrawalCount++;

        if (this.withdrawalCount > this.withdrawalLimit) {
            this.applyPenalty();
        }

        console.log(`✅ Abhebung: €${amount.toFixed(2)}`);
        return true;
    }

    private applyPenalty(): void {
        const penalty = this.getBalance() * this.penaltyRate;
        this.updateBalance(-penalty);
        console.log(`⚠️  Strafgebühr: €${penalty.toFixed(2)}`);
    }
}

export class PremiumSavingsAccount extends SavingsAccount {
    private readonly bonusRate: number = 0.005; // zusätzliche 0.5%
    private readonly minimumMonthlyDeposit: number = 500;
    private vipStatus: boolean = false;

    constructor(owner: string, initialBalance: number) {
        super(owner, initialBalance, 0.003); // 0,3% Zinsen
        this.checkVIPStatus();
    }

    public calculateInterest(): number {
        let interest = super.calculateInterest();
        if (this.vipStatus) {
            interest += this.getBalance() * this.bonusRate / 12; // Bonus pro Monat
        }
        return interest;
    }

    public withdraw(amount: number): boolean {
        if (!this.validateAmount(amount)) {
            console.log('❌ Ungültiger Betrag');
            return false;
        }

        if (!this.canWithdraw(amount)) {
            console.log('❌ Mindestguthaben unterschritten');
            return false;
        }

        this.updateBalance(-amount);
        console.log(`✅ Abhebung: €${amount.toFixed(2)}`);
        return true;
    }

    public upgradeToPremium(): void {
        this.vipStatus = true;
        console.log('🌟 Premium-Status aktiviert!');
    }

    private checkVIPStatus(): boolean {
        this.vipStatus = this.getBalance() >= 10000;
        return this.vipStatus;
    }
}