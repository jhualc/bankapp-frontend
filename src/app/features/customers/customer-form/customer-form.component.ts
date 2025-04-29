import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Customer } from '../../../core/models/customer.model';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CustomerFormComponent implements OnInit {
  form: FormGroup;
  customer?: Customer; // Cliente recibido para edición (opcional)

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<Customer, Customer>,
    @Inject(DIALOG_DATA) public data: { customer?: Customer }
  ) {
    this.customer = data?.customer;
    this.form = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      identification: [
        '',
        [Validators.required, Validators.pattern('^[0-9]*$')],
      ], // 👈 CORREGIDO
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // 👈 CORRECTO
      password: ['', Validators.required],
      status: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.customer) {
      this.form.patchValue({
        name: this.customer.name,
        gender: this.customer.gender,
        age: this.customer.age,
        identification: this.customer.identification,
        address: this.customer.address,
        phone: this.customer.phone,
        password: this.customer.password,
        status: this.customer.status,
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const customerData: Customer = {
      ...this.form.value,
      id: this.customer?.id,
    };

    console.log('👀 Datos enviados al cerrar modal:', customerData); // 👈 Agrega esto

    this.dialogRef.close(customerData);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
