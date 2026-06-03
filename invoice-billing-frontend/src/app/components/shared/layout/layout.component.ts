import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <div class="d-flex">
      <!-- Sidebar -->
      <nav class="sidebar d-flex flex-column p-3">
        <div class="d-flex align-items-center gap-2 mb-4 px-2 py-2">
          <div class="bg-primary rounded-2 p-2"><i class="bi bi-receipt-cutoff text-white fs-5"></i></div>
          <div>
            <div class="text-white fw-bold">InvoicePro</div>
            <div class="text-white-50" style="font-size:0.68rem">Billing System</div>
          </div>
        </div>
        <ul class="nav flex-column gap-1 flex-grow-1">
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-2" routerLink="/dashboard" routerLinkActive="active">
              <i class="bi bi-grid-1x2"></i> Dashboard
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-2" routerLink="/invoices" routerLinkActive="active">
              <i class="bi bi-file-earmark-text"></i> Invoices
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-2" routerLink="/clients" routerLinkActive="active">
              <i class="bi bi-people"></i> Clients
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link d-flex align-items-center gap-2" routerLink="/payments" routerLinkActive="active">
              <i class="bi bi-credit-card"></i> Payments
            </a>
          </li>
        </ul>
        <div class="border-top border-white border-opacity-10 pt-3 mt-3">
          <div class="d-flex align-items-center gap-2 px-2 mb-2">
            <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold" style="width:34px;height:34px;font-size:0.8rem">
              {{ (user?.name || 'U')[0].toUpperCase() }}
            </div>
            <div>
              <div class="text-white small fw-semibold">{{ user?.name }}</div>
              <div class="text-white-50" style="font-size:0.68rem">{{ user?.role }}</div>
            </div>
          </div>
          <button class="nav-link d-flex align-items-center gap-2 btn w-100 text-start" (click)="logout()">
            <i class="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </nav>
      <!-- Main -->
      <div class="main-content w-100">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class LayoutComponent {
  user: any;
  constructor(private auth: AuthService) { this.user = this.auth.getUser(); }
  logout() { this.auth.logout(); }
}
