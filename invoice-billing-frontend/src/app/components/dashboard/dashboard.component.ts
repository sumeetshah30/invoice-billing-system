import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/invoice.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  template: `
    <div class="page-header d-flex justify-content-between align-items-center">
      <div>
        <h5 class="mb-0 fw-bold">Dashboard</h5>
        <p class="text-muted small mb-0">Welcome back! Here's your billing overview.</p>
      </div>
      <a routerLink="/invoices/new" class="btn btn-primary d-flex align-items-center gap-2">
        <i class="bi bi-plus-lg"></i> New Invoice
      </a>
    </div>
    <div class="content-area">
      <div *ngIf="loading" class="text-center py-5"><div class="spinner-border text-primary"></div></div>
      <ng-container *ngIf="!loading && stats">
        <!-- KPI Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="stat-card card bg-white">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="small text-muted fw-semibold text-uppercase" style="letter-spacing:.05em;font-size:.7rem">Total Revenue</div>
                <div class="bg-success bg-opacity-10 rounded-2 p-2"><i class="bi bi-currency-rupee text-success"></i></div>
              </div>
              <div class="h4 fw-bold mb-1">₹{{ stats.totalRevenue | number:'1.0-0' }}</div>
              <div class="small text-success"><i class="bi bi-arrow-up-short"></i> All time collected</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card card bg-white">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="small text-muted fw-semibold text-uppercase" style="letter-spacing:.05em;font-size:.7rem">Outstanding</div>
                <div class="bg-warning bg-opacity-10 rounded-2 p-2"><i class="bi bi-clock-history text-warning"></i></div>
              </div>
              <div class="h4 fw-bold mb-1">₹{{ stats.outstandingAmount | number:'1.0-0' }}</div>
              <div class="small text-warning"><i class="bi bi-dot"></i> {{ stats.totalInvoices - stats.paidInvoices }} invoices pending</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card card bg-white">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="small text-muted fw-semibold text-uppercase" style="letter-spacing:.05em;font-size:.7rem">Overdue</div>
                <div class="bg-danger bg-opacity-10 rounded-2 p-2"><i class="bi bi-exclamation-triangle text-danger"></i></div>
              </div>
              <div class="h4 fw-bold mb-1">₹{{ stats.overdueAmount | number:'1.0-0' }}</div>
              <div class="small text-danger"><i class="bi bi-dot"></i> {{ stats.overdueInvoices }} overdue invoices</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card card bg-white">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <div class="small text-muted fw-semibold text-uppercase" style="letter-spacing:.05em;font-size:.7rem">Total Clients</div>
                <div class="bg-primary bg-opacity-10 rounded-2 p-2"><i class="bi bi-people text-primary"></i></div>
              </div>
              <div class="h4 fw-bold mb-1">{{ stats.totalClients }}</div>
              <div class="small text-primary"><i class="bi bi-dot"></i> {{ stats.totalInvoices }} total invoices</div>
            </div>
          </div>
        </div>

        <!-- Invoice Status Summary -->
        <div class="row g-4 mb-4">
          <div class="col-md-8">
            <div class="card p-4">
              <h6 class="fw-bold mb-3">Monthly Revenue (Last 6 Months)</h6>
              <div class="table-responsive">
                <table class="table table-sm">
                  <thead><tr><th>Month</th><th>Revenue</th><th>Outstanding</th><th>Trend</th></tr></thead>
                  <tbody>
                    <tr *ngFor="let m of stats.monthlyRevenue">
                      <td class="fw-semibold">{{ m.month }}</td>
                      <td class="text-success">₹{{ m.revenue | number:'1.0-0' }}</td>
                      <td class="text-warning">₹{{ m.outstanding | number:'1.0-0' }}</td>
                      <td>
                        <div class="progress" style="height:6px;width:80px">
                          <div class="progress-bar bg-success" [style.width.%]="getPercent(m.revenue)"></div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-4">
              <h6 class="fw-bold mb-3">Invoice Status</h6>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-content-between align-items-center">
                  <span class="status-badge badge-paid">Paid</span>
                  <span class="fw-bold">{{ stats.paidInvoices }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="status-badge badge-overdue">Overdue</span>
                  <span class="fw-bold">{{ stats.overdueInvoices }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="status-badge badge-draft">Draft</span>
                  <span class="fw-bold">{{ stats.draftInvoices }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="status-badge badge-sent">Sent</span>
                  <span class="fw-bold">{{ stats.totalInvoices - stats.paidInvoices - stats.overdueInvoices - stats.draftInvoices }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats?: DashboardStats;
  loading = true;
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getDashboard().subscribe({
      next: (s) => { this.stats = s; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
  getPercent(val: number): number {
    if (!this.stats) return 0;
    const max = Math.max(...this.stats.monthlyRevenue.map(m => m.revenue));
    return max > 0 ? (val / max) * 100 : 0;
  }
}
