import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Account } from '../../../core/models/account.model';
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AccountFormComponent implements OnInit {
  form: FormGroup;
  account?: Account;

  accountTypes = [
    { label: 'Ahorros', value: 'SAVINGS' },
    { label: 'Corriente', value: 'CHECKING' },
  ];
  customers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    public dialogRef: DialogRef<Account>,
    @Inject(DIALOG_DATA) public data: { account?: Account }
  ) {
    this.account = data?.account;
    this.form = this.fb.group({
      accountId: [null], // 👈 Agregado aquí
      accountNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ],
      accountType: ['', Validators.required],
      initialBalance: ['', [Validators.required, Validators.min(0)]],
      status: [true, Validators.required],
      customerId: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data;

        if (this.account) {
          this.form.patchValue({
            accountId: this.account.accountId,
            accountNumber: this.account.accountNumber,
            accountType: this.account.accountType,
            initialBalance: this.account.initialBalance,
            status: this.account.status,
            customerId: this.account.customerId,
          });
        }
      },
      error: (err) => {
        console.error('Error loading customers:', err);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const accountData: Account = this.form.value;

    console.log('👀 Datos enviados al cerrar modal:', accountData);

    this.dialogRef.close(accountData);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
