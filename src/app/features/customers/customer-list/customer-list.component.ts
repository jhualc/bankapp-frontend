import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 Importa CommonModule
import { CustomerService } from '../../../core/services/customer.service';
import { Customer } from '../../../core/models/customer.model';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { Dialog } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, CustomerFormComponent, FormsModule],

  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnInit {
  customers: Customer[] = [];

  searchTerm: string = '';

  constructor(
    private customerService: CustomerService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => {
        this.customers = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          gender: c.gender,
          age: c.age,
          identification: c.identification,
          address: c.address,
          phone: c.phone,
          password: c.password,
          status: c.status,
        }));
      },
      error: (err) => {
        console.error('Error loading customers', err);
      },
    });
  }

  openCustomerModal(customer?: Customer): void {
    const dialogRef = this.dialog.open<Customer, { customer?: Customer }>(
      CustomerFormComponent,
      {
        width: '500px',
        disableClose: false,
        data: customer ? { customer } : undefined,
      }
    );

    dialogRef.closed.subscribe((result) => {
      console.log('👀 Resultado del modal:', result); // 👈 Agrega esto también

      if (result) {
        if (result.id) {
          this.updateCustomer(result);
        } else {
          this.createCustomer(result);
        }
      }
    });
  }

  createCustomer(newCustomer: Customer): void {
    this.customerService.createCustomer(newCustomer).subscribe({
      next: (created) => {
        this.customers.push(created); // ✅ Actualiza la tabla
      },
      error: (err) => {
        console.error('Error creating customer', err);
      },
    });
  }
  updateCustomer(updatedCustomer: Customer): void {
    if (!updatedCustomer || !updatedCustomer.id) {
      console.error('Invalid customer for update');
      return;
    }
    this.customerService
      .updateCustomer(updatedCustomer.id!, updatedCustomer)
      .subscribe({
        next: (saved) => {
          const updatedCustomerMapped: Customer = {
            id: saved.id, // 👈 Mapeas de id
            name: saved.name, // 👈 Mapeas de name
            gender: saved.gender,
            age: saved.age,
            identification: saved.identification,
            address: saved.address,
            phone: saved.phone,
            password: saved.password,
            status: saved.status, // 👈 Mapeas de estado
          };

          const index = this.customers.findIndex(
            (c) => c.id === updatedCustomerMapped.id
          );
          if (index !== -1) {
            this.customers[index] = updatedCustomerMapped;
            this.customers = [...this.customers]; // 👈 Aquí sí detecta el cambio
          }
        },
        error: (err) => {
          console.error('Error updating customer', err);
        },
      });
  }

  deleteCustomer(customer: Customer): void {
    if (!customer.id) {
      console.error('Customer ID is required for deletion');
      return;
    }

    const confirmDelete = confirm(
      `¿Seguro que deseas eliminar a ${customer.name}?`
    );
    if (confirmDelete) {
      this.customerService.deleteCustomer(customer.id).subscribe({
        next: () => {
          // Remueve el cliente de la lista
          this.customers = this.customers.filter((c) => c.id !== customer.id);
        },
        error: (err) => {
          console.error('Error deleting customer', err);
        },
      });
    }
  }

  filteredCustomers(): Customer[] {
    if (!this.searchTerm) {
      return this.customers;
    }

    const lowerSearch = this.searchTerm.toLowerCase();

    return this.customers.filter(
      (customer) =>
        (customer.name && customer.name.toLowerCase().includes(lowerSearch)) ||
        (customer.identification &&
          customer.identification.toLowerCase().includes(lowerSearch))
    );
  }
}
