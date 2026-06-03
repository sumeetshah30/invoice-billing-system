import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Client } from '../../../models/invoice.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div><h5 class="mb-0 fw-bold">Clients</h5><p class="text-muted small mb-0">Manage your client directory</p></div>
      <button class="btn btn-primary" (click)="showModal=true;editClient=null;resetForm()"><i class="bi bi-plus-lg"></i> Add Client</button>
    </div>
    <div class="content-area">
      <div class="row g-3">
        <div class="col-md-4" *ngFor="let c of clients">
          <div class="card p-3 h-100">
            <div class="d-flex align-items-center gap-3 mb-3">
              <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center text-primary fw-bold" style="width:44px;height:44px">{{ c.name[0].toUpperCase() }}</div>
              <div>
                <div class="fw-semibold">{{ c.name }}</div>
                <div class="text-muted small">{{ c.email }}</div>
              </div>
            </div>
            <div class="row g-2 text-center">
              <div class="col-4"><div class="small text-muted">Invoices</div><div class="fw-bold">{{ c.totalInvoices }}</div></div>
              <div class="col-4"><div class="small text-muted">Revenue</div><div class="fw-bold text-success" style="font-size:.85rem">₹{{ c.totalRevenue | number:'1.0-0' }}</div></div>
              <div class="col-4"><div class="small text-muted">Outstanding</div><div class="fw-bold text-warning" style="font-size:.85rem">₹{{ c.outstandingBalance | number:'1.0-0' }}</div></div>
            </div>
            <hr class="my-2"/>
            <div class="d-flex gap-2 mt-auto">
              <button class="btn btn-sm btn-outline-primary flex-grow-1" (click)="edit(c)"><i class="bi bi-pencil"></i> Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal d-block" *ngIf="showModal" style="background:rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-lg"><div class="modal-content">
        <div class="modal-header"><h5 class="modal-title">{{ editClient ? 'Edit' : 'Add' }} Client</h5><button class="btn-close" (click)="showModal=false"></button></div>
        <div class="modal-body">
          <div class="row g-3">
            <div class="col-md-6"><label class="form-label small fw-semibold">Name *</label><input class="form-control" [(ngModel)]="form.name"/></div>
            <div class="col-md-6"><label class="form-label small fw-semibold">Email *</label><input class="form-control" [(ngModel)]="form.email"/></div>
            <div class="col-md-6"><label class="form-label small fw-semibold">Phone</label><input class="form-control" [(ngModel)]="form.phone"/></div>
            <div class="col-md-6"><label class="form-label small fw-semibold">GST Number</label><input class="form-control" [(ngModel)]="form.gstNumber"/></div>
            <div class="col-12"><label class="form-label small fw-semibold">Address</label><input class="form-control" [(ngModel)]="form.address"/></div>
            <div class="col-md-6"><label class="form-label small fw-semibold">City</label><input class="form-control" [(ngModel)]="form.city"/></div>
            <div class="col-md-6"><label class="form-label small fw-semibold">Country</label><input class="form-control" [(ngModel)]="form.country"/></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary btn-sm" (click)="showModal=false">Cancel</button>
          <button class="btn btn-primary btn-sm" (click)="save()">{{ editClient ? 'Update' : 'Create' }} Client</button>
        </div>
      </div></div>
    </div>
  `
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  showModal = false;
  editClient: Client | null = null;
  form: any = {};
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.getClients().subscribe(c => this.clients = c); }
  resetForm() { this.form = { name: '', email: '', phone: '', address: '', city: '', country: 'India', gstNumber: '', currency: 'INR' }; }
  edit(c: Client) { this.editClient = c; this.form = { ...c }; this.showModal = true; }
  save() {
    const req = this.editClient
      ? this.api.updateClient(this.editClient.id, this.form)
      : this.api.createClient(this.form);
    req.subscribe(() => { this.api.getClients().subscribe(c => this.clients = c); this.showModal = false; });
  }
}
