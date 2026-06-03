import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-bg">
      <div class="login-card">
        <div class="text-center mb-4">
          <div class="d-inline-flex align-items-center justify-content-center bg-primary rounded-3 p-3 mb-3">
            <i class="bi bi-receipt-cutoff text-white fs-2"></i>
          </div>
          <h4 class="fw-bold mb-1">InvoicePro</h4>
          <p class="text-muted small">Sign in to your account</p>
        </div>
        <div *ngIf="error" class="alert alert-danger py-2 small">{{ error }}</div>
        <div class="mb-3">
          <label class="form-label fw-semibold small">Email Address</label>
          <input type="email" class="form-control" [(ngModel)]="email" placeholder="admin@invoicepro.com"/>
        </div>
        <div class="mb-4">
          <label class="form-label fw-semibold small">Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" (keyup.enter)="login()"/>
        </div>
        <button class="btn btn-primary w-100 py-2 fw-semibold" (click)="login()" [disabled]="loading">
          <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <div class="mt-4 p-3 bg-light rounded-3">
          <p class="small text-muted mb-1 fw-semibold">Demo credentials:</p>
          <p class="small text-muted mb-0">Admin: admin@invoicepro.com / Admin@123</p>
          <p class="small text-muted mb-0">Staff: staff@invoicepro.com / Staff@123</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = ''; password = ''; loading = false; error = '';
  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}
  login() {
    this.loading = true; this.error = '';
    this.api.login(this.email, this.password).subscribe({
      next: (res) => { this.auth.setUser(res); this.router.navigate(['/dashboard']); },
      error: () => { this.error = 'Invalid credentials. Please try again.'; this.loading = false; }
    });
  }
}
