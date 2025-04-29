export interface Account {
  accountId?: number;
  accountNumber: string;
  accountType: string;
  initialBalance: number;
  status: boolean;
  customerId: number;
  customerName?: string;
}
