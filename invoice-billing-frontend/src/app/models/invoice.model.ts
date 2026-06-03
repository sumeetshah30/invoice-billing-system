export interface Client {
  id: number; name: string; email: string; phone: string;
  address: string; city: string; country: string;
  gstNumber: string; currency: string; isActive: boolean;
  createdAt: string; totalInvoices: number; totalRevenue: number; outstandingBalance: number;
}

export interface InvoiceItem {
  id?: number; description: string; quantity: number;
  unit: string; unitPrice: number; discount: number; amount?: number;
}

export interface Payment {
  id: number; invoiceId: number; invoiceNumber: string;
  amount: number; paymentDate: string; method: string;
  referenceNumber: string; notes: string;
}

export interface Invoice {
  id: number; invoiceNumber: string; clientId: number;
  clientName: string; clientEmail: string;
  invoiceDate: string; dueDate: string; status: string; currency: string;
  subTotal: number; taxRate: number; taxAmount: number;
  discountAmount: number; totalAmount: number; paidAmount: number; balanceDue: number;
  notes: string; terms: string; createdAt: string;
  items: InvoiceItem[]; payments: Payment[];
}

export interface DashboardStats {
  totalRevenue: number; outstandingAmount: number; overdueAmount: number;
  totalClients: number; totalInvoices: number; paidInvoices: number;
  overdueInvoices: number; draftInvoices: number;
  monthlyRevenue: { month: string; revenue: number; outstanding: number }[];
}
