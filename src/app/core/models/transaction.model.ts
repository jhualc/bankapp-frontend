export interface Transaction {
  transactionId?: number;
  accountNumber: string;
  accountType: string;
  initialBalance: number;
  availableBalance: number;
  status: boolean;
  transactionType: 'DEPOSIT' | 'WITHDRAWAL';
  amount: number;
}
