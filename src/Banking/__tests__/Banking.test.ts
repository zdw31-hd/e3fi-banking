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

  });

  test('withdraw: erfolgreicher Abhebungs-Vorgang reduziert Kontostand', () => {

  });

  test('withdraw: unterschreitet Mindestguthaben -> schlägt fehl', () => {

  });

  test('withdraw: nach Überschreiten des Limits wird Strafgebühr berechnet', () => {

  });

  test('applyInterest: Zinsen erhöhen Kontostand und interestEarned', () => {

  });
});

describe('PremiumSavingsAccount', () => {
  test('withdraw: ungültiger Betrag -> false, Kontostand unverändert', () => {

  });

  test('withdraw: unterschreitet Mindestguthaben -> schlägt fehl', () => {

  });

  test('withdraw: gültige Abhebung reduziert Kontostand', () => {

  });

  test('calculateInterest: bei VIP werden Basiszins + Bonuszins berechnet', () => {

  });

  test('upgradeToPremium setzt vipStatus auf true (indirekt über calculateInterest prüfbar)', () => {

  });
});

describe('Abstrakte SavingsAccount-Grundlogik mit TestSavingsAccount', () => {
  test('calculateInterest: liefert erwarteten Zins für gegebene Tage', () => {
 
  });

  test('withdraw: kann Mindestguthaben nicht unterschreiten', () => {

  });

  test('deposit: nutzt validateAmount und erhöht Balance', () => {

  });
});