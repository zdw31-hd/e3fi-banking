  
  // ===========================
  // Testbeispiel
  // ===========================

import { PremiumSavingsAccount, StandardSavingsAccount } from "./Banking/Banking";

  
  console.log('🏦 ===== ONLINE BANKING SYSTEM =====\n');
  
  // Create accounts
  console.log('📝 Konten erstellen...\n');
  
  const standardSavings = new StandardSavingsAccount("customer1", 1000);
  
  const premiumSavings = new PremiumSavingsAccount("customer1", 15000);
  
  // ::Showdown:: Zugriff auf private Member der Basisklasse
  //console.log(standardSavings.owner);
  //console.log(standardSavings.interestEarned);
  
  console.log((standardSavings as any).owner);
  console.log(standardSavings['owner']);
  
  // Perform operations
  console.log('\n💰 Operationen durchführen...\n');
  
  standardSavings.deposit(500);
  standardSavings.withdraw(200);
  standardSavings.applyInterest();
  
  console.log();
  premiumSavings.deposit(2000);
  premiumSavings.applyInterest();
  
  console.log('\n🏦 ===== SYSTEM ENDE =====');