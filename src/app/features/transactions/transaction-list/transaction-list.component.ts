import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction.service';
import { Transaction } from '../../../core/models/transaction.model';
import { FormsModule } from '@angular/forms';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionFormComponent],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];

  constructor(
    private transactionService: TransactionService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        console.log('📥 Datos crudos de transacciones:', data);
        this.transactions = data.map((t: any) => ({
          transactionId: t.transactionId,
          transactionType: t.transactionType,
          amount: t.amount,
          accountId: t.accountId,
          accountNumber: t.accountNumber,
          accountType: t.accountType,
          initialBalance: t.initialBalance,
          availableBalance: t.availableBalance,
          status: t.status,
        }));
      },
      error: (err) => {
        console.error('❌ Error loading transactions:', err);
      },
    });
  }

  openTransactionModal(transactionToEdit?: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '400px',
      disableClose: false,
      data: transactionToEdit ? { transaction: transactionToEdit } : undefined,
    });

    dialogRef.closed.subscribe((result: unknown) => {
      const transactionResult = result as Transaction | undefined;
      if (transactionResult) {
        if (transactionToEdit) {
          console.log('Actualizar transacción (próximamente)');
          // Aquí futuro updateTransaction
        } else {
          this.createTransaction(transactionResult);
        }
      }
    });
  }

  editTransaction(transaction: Transaction): void {
    console.log('✏️ Editar transacción:', transaction);
    this.openTransactionModal(transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar el movimiento de ${transaction.amount}?`
    );
    if (confirmDelete && transaction.transactionId) {
      this.transactionService
        .deleteTransaction(transaction.transactionId)
        .subscribe({
          next: () => {
            console.log('🗑️ Movimiento eliminado');
            this.loadTransactions();
          },
          error: (err) => {
            console.error('❌ Error deleting transaction:', err);
          },
        });
    }
  }

  createTransaction(newTransaction: Transaction): void {
    this.transactionService.createTransaction(newTransaction).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        console.error('❌ Error creating transaction', err);

        const errorMessage =
          err?.error?.message || 'Ocurrió un error al crear la transacción.';

        alert(errorMessage);
      },
    });
  }
}
