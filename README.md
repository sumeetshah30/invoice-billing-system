# 🧾 Invoice & Billing System

A full-stack, production-ready Invoice & Billing System built with **ASP.NET Core Web API**, **Angular 17**, **Entity Framework Core**, **SQL Server**, and **Bootstrap 5**.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=flat-square&logo=angular)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap)
![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?style=flat-square&logo=microsoftsqlserver)

---

## ✨ Features

- 📋 **Invoice Management** — Create, edit, send, and track invoices with line items
- 👥 **Client Management** — Full client profiles, billing history, contact details
- 💳 **Payment Tracking** — Record payments, partial payments, mark invoices as paid
- 📊 **Dashboard Analytics** — Revenue charts, outstanding amounts, monthly summaries
- 🧾 **PDF Generation** — Export professional invoices as PDF
- 🔔 **Overdue Reminders** — Automatic overdue detection and status updates
- 🔐 **JWT Authentication** — Secure role-based access (Admin / Staff)
- 🏷️ **Tax & Discount Support** — GST/VAT, line-level discounts, totals auto-calculated
- 📁 **Multi-Currency** — Support INR, USD, EUR currency display
- 📈 **Reports** — Revenue by client, monthly earnings, payment summaries

---

## 🏗️ Architecture

```
invoice-billing-system/
├── InvoiceBillingSystem.API/          # ASP.NET Core Web API (.NET 8)
│   ├── Controllers/                   # API endpoints
│   │   ├── AuthController.cs
│   │   ├── InvoicesController.cs
│   │   ├── ClientsController.cs
│   │   └── PaymentsController.cs
│   ├── Models/                        # Domain entities
│   ├── DTOs/                          # Request/Response DTOs
│   ├── Services/                      # Business logic layer
│   ├── Interfaces/                    # Service contracts
│   ├── Data/                          # EF Core DbContext
│   └── Helpers/                       # JWT, PDF helpers
│
└── invoice-billing-frontend/          # Angular 17 SPA
    └── src/app/
        ├── components/
        │   ├── dashboard/             # Analytics dashboard
        │   ├── invoices/              # Invoice CRUD + PDF
        │   ├── clients/               # Client management
        │   ├── payments/              # Payment recording
        │   └── reports/               # Revenue reports
        ├── services/                  # HTTP service layer
        ├── guards/                    # Auth route guards
        └── interceptors/              # JWT interceptor
```

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) & npm
- [SQL Server](https://www.microsoft.com/en-us/sql-server) or SQL Server Express
- [Angular CLI](https://angular.io/cli): `npm install -g @angular/cli`

### Backend Setup

```bash
cd InvoiceBillingSystem.API

# Restore packages
dotnet restore

# Update appsettings.json with your SQL Server connection string
# "ConnectionStrings": { "DefaultConnection": "Server=.;Database=InvoiceBillingDB;..." }

# Apply migrations
dotnet ef database update

# Run API (http://localhost:5000)
dotnet run
```

### Frontend Setup

```bash
cd invoice-billing-frontend

# Install dependencies
npm install

# Start dev server (http://localhost:4200)
ng serve
```

### Default Login
| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@invoicepro.com | Admin@123 |
| Staff | staff@invoicepro.com | Staff@123 |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| Database | SQL Server / SQL Server Express |
| Authentication | JWT Bearer Tokens |
| Frontend | Angular 17 (Standalone Components) |
| UI Framework | Bootstrap 5.3 + Custom CSS |
| Charts | Chart.js via ng2-charts |
| PDF | DinkToPdf / iTextSharp |
| Validation | FluentValidation |
| Mapping | AutoMapper |

---

## 📸 Key Screens

- **Dashboard** — KPI cards (total revenue, outstanding, paid, overdue), revenue trend chart, recent invoices table
- **Invoice List** — Filterable, sortable invoice table with status badges and quick actions
- **Create Invoice** — Dynamic line items, auto-calculated subtotal/tax/total, client autocomplete
- **Client Profile** — Contact info, all invoices, payment history, outstanding balance
- **Payment Modal** — Record full/partial payment with date and payment method

---

## 📄 License

MIT License — free to use and modify.

---

*Built by [Sumeet Shah](https://github.com/sumeetshah30) — Software Engineer*
