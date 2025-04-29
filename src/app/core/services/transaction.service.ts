import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`; // ✅ Ajusta si tu base cambia

  constructor(private http: HttpClient) {}

  // ✅ Obtener todas las transacciones
  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  // ✅ Crear nueva transacción
  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  // ✅ Eliminar una transacción por ID
  deleteTransaction(transactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${transactionId}`);
  }

  // ✅ (Opcional futuro) Actualizar una transacción
  updateTransaction(
    transactionId: number,
    transaction: Transaction
  ): Observable<Transaction> {
    return this.http.put<Transaction>(
      `${this.apiUrl}/${transactionId}`,
      transaction
    );
  }
}
