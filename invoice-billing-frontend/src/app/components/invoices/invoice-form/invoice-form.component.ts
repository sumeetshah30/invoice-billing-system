import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Client, InvoiceItem } from '../../../models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div><h5 class="mb-0 fw-bold">Create Invoice</h5><p class="text-muted small mb-0">Fill in the details below</p></div>
      <a routerLink="/invoices" class="btn btn-outline-secondary btn-sm">← Back</a>
    </div>
    <div class="content-area">
      <div class="row g-4">
        <div class="col-md-8">
          <div class="card p-4 mb-3">
            <h6 class="fw-bold mb-3">Client & Dates</h6>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-semibold">Client *</label>
                <select class="form-select" [(ngModel)]="form.clientId" required>
                  <option [value]="0" disabled>Select client</option>
                  <option *ngFor="let c of clients" [value]="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Invoice Date *</label>
                <input type="date" class="form-control" [(ngModel)]="form.invoiceDate"/>
              </div>
              <div class="col-md-3">
                <label class="form-label small fw-semibold">Due Date *</label>
                <input type="date" class="form-control" [(ngModel)]="form.dueDate"/>
              </div>
            </div>
          </div>
          <div class="card p-4 mb-3">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold mb-0">Line Items</h6>
              <button class="btn btn-sm btn-outline-primary" (click)="addItem()"><i class="bi bi-plus"></i> Add Item</button>
            </div>
            <div class="table-responsive">
              <table class="table table-sm">
                <thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Price</th><th>Discount</th><th>Amount</th><th></th></tr></thead>
                <tbody>
                  <tr *ngFor="let item of form.items; let i = index">
                    <td><input class="form-control form-control-sm" [(ngModel)]="item.description" placeholder="Service description"/></td>
                    <td><input type="number" class="form-control form-control-sm" style="width:70px" [(ngModel)]="item.quantity" (ngModelChange)="calc()"/></td>
                    <td><input class="form-control form-control-sm" style="width:60px" [(ngModel)]="item.unit"/></td>
                    <td><input type="number" class="form-control form-control-sm" style="width:90px" [(ngModel)]="item.unitPrice" (ngModelChange)="calc()"/></td>
                    <td><input type="number" class="form-control form-control-sm" style="width:80px" [(ngModel)]="item.discount" (ngModelChange)="calc()"/></td>
                    <td class="fw-semibold">₹{{ getItemAmount(item) | number:'1.0-0' }}</td>
                    <td><button class="btn btn-sm btn-link text-danger p-0" (click)="removeItem(i)"><i class="bi bi-x"></i></button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card p-4">
            <h6 class="fw-bold mb-3">Notes & Terms</h6>
            <div class="row g-3">
              <div class="col-md-6"><label class="form-label small fw-semibold">Notes</label><textarea class="form-control" rows="3" [(ngModel)]="form.notes"></textarea></div>
              <div class="col-md-6"><label class="form-label small fw-semibold">Terms</label><textarea class="form-control" rows="3" [(ngModel)]="form.terms"></textarea></div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card p-4 mb-3">
            <h6 class="fw-bold mb-3">Summary</h6>
            <div class="d-flex justify-content-between mb-2"><span class="text-muted">Subtotal</span><span>₹{{ subTotal | number:'1.2-2' }}</span></div>
            <div class="row g-2 align-items-center mb-2">
              <div class="col-6 text-muted">Tax Rate (%)</div>
              <div class="col-6"><input type="number" class="form-control form-control-sm" [(ngModel)]="form.taxRate" (ngModelChange)="calc()"/></div>
            </div>
            <div class="d-flex justify-content-between mb-2"><span class="text-muted">Tax Amount</span><span>₹{{ taxAmount | number:'1.2-2' }}</span></div>
            <div class="row g-2 align-items-center mb-2">
              <div class="col-6 text-muted">Discount</div>
              <div class="col-6"><input type="number" class="form-control form-control-sm" [(ngModel)]="form.discountAmount" (ngModelChange)="calc()"/></div>
            </div>
            <hr/>
            <div class="d-flex justify-content-between fw-bold fs-6"><span>Total</span><span>₹{{ total | number:'1.2-2' }}</span></div>
          </div>
          <button class="btn btn-primary w-100 py-2 fw-semibold" (click)="submit()" [disabled]="saving">
            <span *ngIf="saving" class="spinner-border spinner-border-sm me-2"></span>
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  `
})
export class InvoiceFormComponent implements OnInit {
  clients: Client[] = [];
  form: any = { clientId: 0, invoiceDate: new Date().toISOString().split('T')[0], dueDate: '', currency: 'INR', taxRate: 18, discountAmount: 0, notes: '', terms: 'Payment due within 30 days.', items: [] };
  subTotal = 0; taxAmount = 0; total = 0; saving = false;

  constructor(private api: ApiService, private router: Router) {}
  ngOnInit() { this.api.getClients().subscribe(c => this.clients = c); this.addItem(); }
  addItem() { this.form.items.push({ description: '', quantity: 1, unit: 'hrs', unitPrice: 0, discount: 0 }); }
  removeItem(i: number) { this.form.items.splice(i, 1); this.calc(); }
  getItemAmount(item: any) { return (item.quantity * item.unitPrice) - item.discount; }
  calc() {
    this.subTotal = this.form.items.reduce((s: number, i: any) => s + this.getItemAmount(i), 0);
    this.taxAmount = Math.round((this.subTotal * (this.form.taxRate / 100)) * 100) / 100;
    this.total = this.subTotal + this.taxAmount - this.form.discountAmount;
  }
  submit() {
    this.saving = true;
    this.api.createInvoice(this.form).subscribe({
      next: () => this.router.navigate(['/invoices']),
      error: () => { this.saving = false; }
    });
  }
}
