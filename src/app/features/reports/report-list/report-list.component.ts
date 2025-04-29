import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services/report.service';
import { Customer } from '../../../core/models/customer.model';
import { CustomerService } from '../../../core/services/customer.service';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css'],
})
export class ReportListComponent {
  customerId!: number;
  startDate!: string;
  endDate!: string;
  reportData: any[] = [];
  loading = false;
  customers: Customer[] = [];
  selectedCustomerId: number | null = null;

  constructor(
    private reportService: ReportService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getAllCustomers().subscribe({
      next: (data) => (this.customers = data),
      error: (err) => console.error('Error cargando clientes:', err),
    });
  }

  fetchReport(): void {
    if (!this.selectedCustomerId || !this.startDate || !this.endDate) {
      alert('Por favor complete todos los campos');
      return;
    }

    this.loading = true;
    this.reportService
      .getReport(this.selectedCustomerId, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.reportData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching report', err);
          this.loading = false;
        },
      });
  }

  downloadPdf(): void {
    if (!this.selectedCustomerId || !this.startDate || !this.endDate) {
      alert('Por favor complete todos los campos');
      return;
    }

    this.reportService
      .downloadPdf(this.selectedCustomerId, this.startDate, this.endDate)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `reporte_${this.selectedCustomerId}.pdf`;
          a.click();
        },
        error: (err) => {
          console.error('Error downloading PDF', err);
        },
      });
  }
}
