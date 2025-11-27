import { StandardSavingsAccount, PremiumSavingsAccount, SavingsAccount } from "../Banking";
// Hilfsklasse, um die abstrakte SavingsAccount testen zu können
class TestSavingsAccount extends SavingsAccount {
  public withdraw(amount: number): boolean {
    if (!this['validateAmount'](amount)) {
      return false;
    }
    if (!this['canWithdraw'](amount)) {
      return false;
    }
    this['updateBalance'](-amount);
    return true;
  }
}

describe('StandardSavingsAccount', () => {
  test('deposit: gültiger Betrag erhöht Kontostand und gibt true zurück', () => {
    const acc = new StandardSavingsAccount('Kunde', 1000);

    const result = acc.deposit(500);

    expect(result).toBe(true);
    expect(acc.getBalance()).toBe(1500);
  });

  test('deposit: ungültiger Betrag (<= 0) verändert Kontostand nicht und gibt false zurück', () => {
    const acc = new StandardSavingsAccount('Kunde', 1000);

    const result = acc.deposit(-100);

    expect(result).toBe(false);
    expect(acc.getBalance()).toBe(1000);
  });

  test('withdraw: erfolgreicher Abhebungs-Vorgang reduziert Kontostand', () => {
    const acc = new StandardSavingsAccount('Kunde', 1000);

    const result = acc.withdraw(200);

    expect(result).toBe(true);
    expect(acc.getBalance()).toBe(800);
  });

  test('withdraw: unterschreitet Mindestguthaben -> schlägt fehl', () => {
    const acc = new StandardSavingsAccount('Kunde', 150);

    const result = acc.withdraw(60); // 150 - 60 = 90 < 100

    expect(result).toBe(false);
    expect(acc.getBalance()).toBe(150);
  });

  test('withdraw: nach Überschreiten des Limits wird Strafgebühr berechnet', () => {
    const acc = new StandardSavingsAccount('Kunde', 1000);

    acc.withdraw(100);
    acc.withdraw(100);
    acc.withdraw(100);
    const result = acc.withdraw(100); // 4. Abhebung -> Strafgebühr 1%

    expect(result).toBe(true);
    expect(acc.getBalance()).toBeCloseTo(594, 6); // 1000 - 4*100 = 600, -1% Strafgebühr = 594
  });

  test('applyInterest: Zinsen erhöhen Kontostand und interestEarned', () => {
    const acc = new StandardSavingsAccount('Kunde', 1000);
    const past = new Date();
    past.setDate(past.getDate() - 30);
    (acc as any).lastInterestDate = past;

    const expectedInterest = (1000 * 0.002 * 30) / 36500;

    acc.applyInterest();

    expect(acc.getBalance()).toBeCloseTo(1000 + expectedInterest, 6);
    expect((acc as any).interestEarned).toBeCloseTo(expectedInterest, 6);
  });
});

describe('PremiumSavingsAccount', () => {
  test('withdraw: ungültiger Betrag -> false, Kontostand unverändert', () => {
    const acc = new PremiumSavingsAccount('Kunde', 1000);

    const result = acc.withdraw(-50);

    expect(result).toBe(false);
    expect(acc.getBalance()).toBe(1000);
  });

  test('withdraw: unterschreitet Mindestguthaben -> schlägt fehl', () => {
    const acc = new PremiumSavingsAccount('Kunde', 200);

    const result = acc.withdraw(150); // 200 - 150 = 50 < 100

    expect(result).toBe(false);
    expect(acc.getBalance()).toBe(200);
  });

  test('withdraw: gültige Abhebung reduziert Kontostand', () => {
    const acc = new PremiumSavingsAccount('Kunde', 500);

    const result = acc.withdraw(150);

    expect(result).toBe(true);
    expect(acc.getBalance()).toBe(350);
  });

  test('calculateInterest: bei VIP werden Basiszins + Bonuszins berechnet', () => {
    const acc = new PremiumSavingsAccount('Kunde', 12000); // VIP via checkVIPStatus
    const past = new Date();
    past.setDate(past.getDate() - 30);
    (acc as any).lastInterestDate = past;

    const balance = acc.getBalance();
    const baseInterest = (balance * 0.003 * 30) / 36500;
    const bonusInterest = (balance * 0.005) / 12;

    const interest = acc.calculateInterest();

    expect(interest).toBeCloseTo(baseInterest + bonusInterest, 6);
  });

  test('upgradeToPremium setzt vipStatus auf true (indirekt über calculateInterest prüfbar)', () => {
    const acc = new PremiumSavingsAccount('Kunde', 5000); // kein VIP zu Beginn
    const past = new Date();
    past.setDate(past.getDate() - 15);
    (acc as any).lastInterestDate = past;

    const baseInterest = acc.calculateInterest();

    acc.upgradeToPremium();
    (acc as any).lastInterestDate = past; // gleiche Basis für Vergleich
    const interestWithVip = acc.calculateInterest();
    const expectedBonus = (acc.getBalance() * 0.005) / 12;

    expect(interestWithVip).toBeCloseTo(baseInterest + expectedBonus, 6);
  });
});

describe('Abstrakte SavingsAccount-Grundlogik mit TestSavingsAccount', () => {
  test('calculateInterest: liefert erwarteten Zins für gegebene Tage', () => {
    const balance = 1000;
    const rate = 0.5; // 0.5% p.a.
    const acc = new TestSavingsAccount('Kunde', balance, rate);

    const past = new Date();
    past.setDate(past.getDate() - 10); // 10 Tage
    (acc as any).lastInterestDate = past;

    const interest = acc.calculateInterest();
    const expected = (balance * rate * 10) / 36500;

    expect(interest).toBeCloseTo(expected, 5);
  });

  test('withdraw: kann Mindestguthaben nicht unterschreiten', () => {
    const acc = new TestSavingsAccount('Kunde', 200, 0.5);

    const result = acc.withdraw(150); // 200 - 150 = 50 < 100 -> false

    expect(result).toBe(false);
    expect(acc.getBalance()).toBe(200);
  });

  test('deposit: nutzt validateAmount und erhöht Balance', () => {
    const acc = new TestSavingsAccount('Kunde', 100, 0.5);

    const result = acc.deposit(50);

    expect(result).toBe(true);
    expect(acc.getBalance()).toBe(150);
  });
});
