import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { Transaction } from '../../../core/models/transaction.model';
import { AccountService } from '../../../core/services/account.service';
import { Account } from '../../../core/models/account.model';
import { TransactionType } from '../../../core/enums/transaction-type.enum';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css'],
})
export class TransactionFormComponent implements OnInit {
  form: FormGroup;
  accounts: Account[] = [];
  transactionTypes: string[] = []; // ⚡ Nuevo: Lista para los tipos de transacción

  constructor(
    private fb: FormBuilder,
    private dialogRef: DialogRef<Transaction>,
    private accountService: AccountService
  ) {
    this.form = this.fb.group({
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      accountId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.loadTransactionTypes();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
      },
    });
  }

  loadTransactionTypes(): void {
    // ⚡ Carga dinámica desde el Enum
    this.transactionTypes = Object.keys(TransactionType);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    const transactionToSend: any = {
      transactionType: formValue.type, // 🚀 Enviar transactionType como espera el backend
      amount: formValue.amount,
      accountId: formValue.accountId,
    };

    this.dialogRef.close(transactionToSend);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
