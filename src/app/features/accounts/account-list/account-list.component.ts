import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../core/services/account.service';
import { Account } from '../../../core/models/account.model';
import { AccountFormComponent } from '../accounts-form/account-form.component';
import { Dialog } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms'; // para el buscador

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, FormsModule, AccountFormComponent],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  searchTerm: string = '';

  constructor(private accountService: AccountService, private dialog: Dialog) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        console.log('📥 Datos crudos de cuentas recibidos:', data);

        this.accounts = data.map((c: any) => ({
          accountId: c.accountId ?? c.id,
          accountNumber: c.accountNumber,
          accountType: c.accountType,
          initialBalance: c.initialBalance,
          status: c.status,
          customerId: c.customerId ?? c.customer?.customerId ?? c.customer?.id,
          customerName: c.customerName,
        }));

        console.log('✅ Cuentas cargadas:', this.accounts);
      },
      error: (err) => {
        console.error('❌ Error loading accounts', err);
      },
    });
  }

  openAccountModal(accountToEdit?: Account): void {
    const dialogRef = this.dialog.open(AccountFormComponent, {
      width: '500px',
      disableClose: false,
      data: accountToEdit ? { account: accountToEdit } : undefined,
    });

    dialogRef.closed.subscribe((result: unknown) => {
      const accountResult = result as Account | undefined;

      if (accountResult) {
        console.log('📝 Resultado del modal:', accountResult);

        if (
          accountResult.accountId !== null &&
          accountResult.accountId !== undefined
        ) {
          console.log('✏️ Actualizando cuenta:', accountResult.accountId);
          this.updateAccount(accountResult);
        } else {
          console.log('➕ Creando nueva cuenta');
          this.createAccount(accountResult);
        }
      }
    });
  }

  createAccount(newAccount: Account): void {
    console.log('🚀 Creando cuenta:', newAccount);

    this.accountService.createAccount(newAccount).subscribe({
      next: (created) => {
        this.accounts.push(created); // ✅ Este created tiene el accountId del backend
        this.accounts = [...this.accounts];
        console.log('✅ Cuenta creada:', created);
      },
      error: (err) => {
        console.error('❌ Error creating account', err);
      },
    });
  }
  updateAccount(updatedAccount: Account): void {
    if (!updatedAccount || !updatedAccount.accountId) {
      console.error('❌ Invalid account for update');
      return;
    }

    console.log('✏️ Actualizando cuenta:', updatedAccount);

    // 🔥 SOLUCIÓN: asegurar que customerId sea número
    updatedAccount.customerId = Number(updatedAccount.customerId);

    console.log('Updated Account::', updatedAccount);

    this.accountService
      .updateAccount(updatedAccount.accountId, updatedAccount)
      .subscribe({
        next: (saved) => {
          console.log('✅ Cuenta actualizada:', saved);

          const updatedMapped: Account = {
            accountId: saved.accountId,
            accountNumber: saved.accountNumber,
            accountType: saved.accountType,
            initialBalance: saved.initialBalance,
            status: saved.status,
            customerId: saved.customerId,
          };

          const index = this.accounts.findIndex(
            (a) => a.accountId === updatedMapped.accountId
          );
          if (index !== -1) {
            this.accounts[index] = updatedMapped;
            this.accounts = [...this.accounts];
          }
        },
        error: (err) => {
          console.error('❌ Error updating account', err);
        },
      });
  }

  deleteAccount(account: Account): void {
    if (!account.accountId) {
      console.error('❌ Account ID is required for deletion');
      return;
    }

    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar la cuenta ${account.accountNumber}?`
    );
    if (confirmDelete) {
      this.accountService.deleteAccount(account.accountId).subscribe({
        next: () => {
          console.log('🗑️ Cuenta eliminada');
          this.accounts = this.accounts.filter(
            (a) => a.accountId !== account.accountId
          );
        },
        error: (err) => {
          console.error('❌ Error deleting account', err);
        },
      });
    }
  }

  filteredAccounts(): Account[] {
    if (!this.searchTerm) {
      return this.accounts;
    }

    const lowerSearch = this.searchTerm.toLowerCase();

    return this.accounts.filter(
      (account) =>
        (account.accountNumber &&
          account.accountNumber.toLowerCase().includes(lowerSearch)) ||
        (account.accountType &&
          account.accountType.toLowerCase().includes(lowerSearch))
    );
  }
}
