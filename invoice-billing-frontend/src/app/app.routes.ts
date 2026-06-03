import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./components/shared/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'invoices', loadComponent: () => import('./components/invoices/invoice-list/invoice-list.component').then(m => m.InvoiceListComponent) },
      { path: 'invoices/new', loadComponent: () => import('./components/invoices/invoice-form/invoice-form.component').then(m => m.InvoiceFormComponent) },
      { path: 'invoices/:id', loadComponent: () => import('./components/invoices/invoice-detail/invoice-detail.component').then(m => m.InvoiceDetailComponent) },
      { path: 'clients', loadComponent: () => import('./components/clients/client-list/client-list.component').then(m => m.ClientListComponent) },
      { path: 'payments', loadComponent: () => import('./components/payments/payment-list/payment-list.component').then(m => m.PaymentListComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
