import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Invoice } from '../../../models/invoice.model';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div><h5 class="mb-0 fw-bold">Invoices</h5><p class="text-muted small mb-0">Manage all your invoices</p></div>
      <a routerLink="/invoices/new" class="btn btn-primary d-flex align-items-center gap-2"><i class="bi bi-plus-lg"></i> New Invoice</a>
    </div>
    <div class="content-area">
      <div class="card p-3 mb-3">
        <div class="row g-2 align-items-center">
          <div class="col-md-4">
            <input class="form-control" placeholder="Search invoices..." [(ngModel)]="search"/>
          </div>
          <div class="col-md-2">
            <select class="form-select" [(ngModel)]="statusFilter">
              <option value="">All Status</option>
              <option>Draft</option><option>Sent</option><option>Paid</option>
              <option>Overdue</option><option>PartiallyPaid</option>
            </select>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="table-responsive">
          <table class="table invoice-table mb-0">
            <thead><tr>
              <th class="ps-4">Invoice #</th><th>Client</th><th>Date</th>
              <th>Due Date</th><th>Amount</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              <tr *ngFor="let inv of filtered">
                <td class="ps-4 fw-semibold">{{ inv.invoiceNumber }}</td>
                <td>
                  <div class="fw-semibold small">{{ inv.clientName }}</div>
                  <div class="text-muted" style="font-size:.75rem">{{ inv.clientEmail }}</div>
                </td>
                <td class="small">{{ inv.invoiceDate | date:'dd MMM yyyy' }}</td>
                <td class="small">{{ inv.dueDate | date:'dd MMM yyyy' }}</td>
                <td>
                  <div class="fw-bold">₹{{ inv.totalAmount | number:'1.0-0' }}</div>
                  <div class="text-muted" style="font-size:.72rem">Due: ₹{{ inv.balanceDue | number:'1.0-0' }}</div>
                </td>
                <td><span class="status-badge badge-{{ inv.status.toLowerCase() }}">{{ inv.status }}</span></td>
                <td>
                  <div class="d-flex gap-1">
                    <a [routerLink]="['/invoices', inv.id]" class="btn btn-sm btn-light border"><i class="bi bi-eye"></i></a>
                    <button class="btn btn-sm btn-light border" (click)="markPaid(inv)" *ngIf="inv.status !== 'Paid'"><i class="bi bi-check-circle text-success"></i></button>
                    <button class="btn btn-sm btn-light border" (click)="deleteInv(inv.id)"><i class="bi bi-trash text-danger"></i></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="7" class="text-center text-muted py-5">No invoices found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  search = ''; statusFilter = '';
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getInvoices().subscribe(d => this.invoices = d); }
  get filtered() {
    return this.invoices.filter(i =>
      (i.invoiceNumber.toLowerCase().includes(this.search.toLowerCase()) ||
       i.clientName.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.statusFilter || i.status === this.statusFilter)
    );
  }
  markPaid(inv: Invoice) {
    this.api.updateStatus(inv.id, 'Paid').subscribe(u => {
      const idx = this.invoices.findIndex(i => i.id === inv.id);
      if (idx !== -1) this.invoices[idx] = u;
    });
  }
  deleteInv(id: number) {
    if (confirm('Delete this invoice?'))
      this.api.deleteInvoice(id).subscribe(() => this.invoices = this.invoices.filter(i => i.id !== id));
  }
}
