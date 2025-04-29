import { Routes } from '@angular/router';
import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { AccountListComponent } from './features/accounts/account-list/account-list.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { ReportListComponent } from './features/reports/report-list/report-list.component';

export const routes: Routes = [
  { path: 'customers', component: CustomerListComponent },
  { path: 'accounts', component: AccountListComponent },
  { path: 'transactions', component: TransactionListComponent },
  { path: 'reports', component: ReportListComponent },
  { path: '', redirectTo: 'customers', pathMatch: 'full' }, // Redireccionar por defecto a Customers
];
