import { Account } from "../../Banking/Banking";

export interface AccountViewModel {
  accountNumber: string;
  balance: number;
  type: string;
}

export const toAccountViewModel = (account: Account): AccountViewModel => ({
  accountNumber: account.getAccountNumber(),
  balance: account.getBalance(),
  type: account.constructor.name,
});
