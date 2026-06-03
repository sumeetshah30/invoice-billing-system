import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { Payment } from '../../../models/invoice.model';

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-header">
      <h5 class="mb-0 fw-bold">Payments</h5>
      <p class="text-muted small mb-0">All recorded payments</p>
    </div>
    <div class="content-area">
      <div class="card">
        <div class="table-responsive">
          <table class="table invoice-table mb-0">
            <thead><tr><th class="ps-4">Invoice #</th><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th></tr></thead>
            <tbody>
              <tr *ngFor="let p of payments">
                <td class="ps-4 fw-semibold">{{ p.invoiceNumber }}</td>
                <td>{{ p.paymentDate | date:'dd MMM yyyy' }}</td>
                <td class="text-success fw-bold">₹{{ p.amount | number:'1.2-2' }}</td>
                <td><span class="badge bg-light text-dark border">{{ p.method }}</span></td>
                <td class="text-muted small">{{ p.referenceNumber || '—' }}</td>
              </tr>
              <tr *ngIf="payments.length === 0"><td colspan="5" class="text-center text-muted py-5">No payments recorded yet</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getPayments().subscribe(p => this.payments = p); }
}
