import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Invoice } from '../../../models/invoice.model';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div *ngIf="invoice">
      <div class="page-header d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0 fw-bold">{{ invoice.invoiceNumber }}</h5>
          <span class="status-badge badge-{{ invoice.status.toLowerCase() }}">{{ invoice.status }}</span>
        </div>
        <div class="d-flex gap-2">
          <a routerLink="/invoices" class="btn btn-outline-secondary btn-sm">← Back</a>
          <button class="btn btn-success btn-sm" *ngIf="invoice.status !== 'Paid'" (click)="showPayModal = true">Record Payment</button>
        </div>
      </div>
      <div class="content-area">
        <div class="card p-4 mb-3">
          <div class="row">
            <div class="col-md-6">
              <div class="fw-bold fs-5 mb-1">{{ invoice.clientName }}</div>
              <div class="text-muted small">{{ invoice.clientEmail }}</div>
            </div>
            <div class="col-md-6 text-md-end">
              <div class="small text-muted">Invoice Date: <span class="fw-semibold text-dark">{{ invoice.invoiceDate | date }}</span></div>
              <div class="small text-muted">Due Date: <span class="fw-semibold text-dark">{{ invoice.dueDate | date }}</span></div>
            </div>
          </div>
        </div>
        <div class="card p-4 mb-3">
          <table class="table table-sm">
            <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Price</th><th>Discount</th><th class="text-end">Amount</th></tr></thead>
            <tbody>
              <tr *ngFor="let item of invoice.items">
                <td>{{ item.description }}</td><td>{{ item.quantity }}</td>
                <td>{{ item.unit }}</td><td>₹{{ item.unitPrice | number:'1.2-2' }}</td>
                <td>₹{{ item.discount | number:'1.2-2' }}</td>
                <td class="text-end fw-semibold">₹{{ item.amount | number:'1.2-2' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr><td colspan="5" class="text-end text-muted">Subtotal</td><td class="text-end">₹{{ invoice.subTotal | number:'1.2-2' }}</td></tr>
              <tr><td colspan="5" class="text-end text-muted">Tax ({{ invoice.taxRate }}%)</td><td class="text-end">₹{{ invoice.taxAmount | number:'1.2-2' }}</td></tr>
              <tr><td colspan="5" class="text-end fw-bold">Total</td><td class="text-end fw-bold fs-6">₹{{ invoice.totalAmount | number:'1.2-2' }}</td></tr>
              <tr><td colspan="5" class="text-end text-success">Paid</td><td class="text-end text-success">₹{{ invoice.paidAmount | number:'1.2-2' }}</td></tr>
              <tr><td colspan="5" class="text-end text-danger fw-bold">Balance Due</td><td class="text-end text-danger fw-bold">₹{{ invoice.balanceDue | number:'1.2-2' }}</td></tr>
            </tfoot>
          </table>
        </div>
        <div class="card p-4" *ngIf="invoice.payments.length > 0">
          <h6 class="fw-bold mb-3">Payment History</h6>
          <table class="table table-sm">
            <thead><tr><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th></tr></thead>
            <tbody>
              <tr *ngFor="let p of invoice.payments">
                <td>{{ p.paymentDate | date }}</td>
                <td class="text-success fw-semibold">₹{{ p.amount | number:'1.2-2' }}</td>
                <td>{{ p.method }}</td><td>{{ p.referenceNumber }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- Payment Modal -->
      <div class="modal d-block" *ngIf="showPayModal" style="background:rgba(0,0,0,0.5)">
        <div class="modal-dialog"><div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Record Payment</h5><button class="btn-close" (click)="showPayModal=false"></button></div>
          <div class="modal-body">
            <div class="mb-3"><label class="form-label small fw-semibold">Amount</label><input type="number" class="form-control" [(ngModel)]="payForm.amount" [max]="invoice.balanceDue"/></div>
            <div class="mb-3"><label class="form-label small fw-semibold">Payment Date</label><input type="date" class="form-control" [(ngModel)]="payForm.paymentDate"/></div>
            <div class="mb-3"><label class="form-label small fw-semibold">Method</label>
              <select class="form-select" [(ngModel)]="payForm.method">
                <option>BankTransfer</option><option>UPI</option><option>Cash</option><option>Card</option><option>Cheque</option>
              </select>
            </div>
            <div class="mb-3"><label class="form-label small fw-semibold">Reference #</label><input class="form-control" [(ngModel)]="payForm.referenceNumber"/></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" (click)="showPayModal=false">Cancel</button>
            <button class="btn btn-success btn-sm" (click)="submitPayment()">Record Payment</button>
          </div>
        </div></div>
      </div>
    </div>
  `
})
export class InvoiceDetailComponent implements OnInit {
  invoice?: Invoice;
  showPayModal = false;
  payForm: any = { amount: 0, paymentDate: new Date().toISOString().split('T')[0], method: 'BankTransfer', referenceNumber: '' };
  constructor(private api: ApiService, private route: ActivatedRoute) {}
  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.api.getInvoice(id).subscribe(i => { this.invoice = i; this.payForm.amount = i.balanceDue; });
  }
  submitPayment() {
    if (!this.invoice) return;
    this.api.createPayment({ ...this.payForm, invoiceId: this.invoice.id }).subscribe(() => {
      this.api.getInvoice(this.invoice!.id).subscribe(i => { this.invoice = i; this.showPayModal = false; });
    });
  }
}
