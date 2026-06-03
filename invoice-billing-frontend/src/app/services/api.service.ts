import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, Invoice, Payment, DashboardStats } from '../models/invoice.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:5000/api';
  constructor(private http: HttpClient) {}

  // Auth
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/auth/login`, { email, password });
  }

  // Dashboard
  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/invoices/dashboard`);
  }

  // Invoices
  getInvoices(): Observable<Invoice[]> { return this.http.get<Invoice[]>(`${this.base}/invoices`); }
  getInvoice(id: number): Observable<Invoice> { return this.http.get<Invoice>(`${this.base}/invoices/${id}`); }
  createInvoice(data: any): Observable<Invoice> { return this.http.post<Invoice>(`${this.base}/invoices`, data); }
  updateInvoice(id: number, data: any): Observable<Invoice> { return this.http.put<Invoice>(`${this.base}/invoices/${id}`, data); }
  updateStatus(id: number, status: string): Observable<Invoice> { return this.http.patch<Invoice>(`${this.base}/invoices/${id}/status`, JSON.stringify(status), { headers: { 'Content-Type': 'application/json' } }); }
  deleteInvoice(id: number): Observable<void> { return this.http.delete<void>(`${this.base}/invoices/${id}`); }

  // Clients
  getClients(): Observable<Client[]> { return this.http.get<Client[]>(`${this.base}/clients`); }
  getClient(id: number): Observable<Client> { return this.http.get<Client>(`${this.base}/clients/${id}`); }
  createClient(data: any): Observable<Client> { return this.http.post<Client>(`${this.base}/clients`, data); }
  updateClient(id: number, data: any): Observable<Client> { return this.http.put<Client>(`${this.base}/clients/${id}`, data); }

  // Payments
  getPayments(): Observable<Payment[]> { return this.http.get<Payment[]>(`${this.base}/payments`); }
  createPayment(data: any): Observable<Payment> { return this.http.post<Payment>(`${this.base}/payments`, data); }
}
