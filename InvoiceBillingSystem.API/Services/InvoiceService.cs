using AutoMapper;
using InvoiceBillingSystem.API.Data;
using InvoiceBillingSystem.API.DTOs;
using InvoiceBillingSystem.API.Interfaces;
using InvoiceBillingSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvoiceBillingSystem.API.Services;

public class InvoiceService : IInvoiceService
{
    private readonly AppDbContext _ctx;
    private readonly IMapper _mapper;

    public InvoiceService(AppDbContext ctx, IMapper mapper)
    { _ctx = ctx; _mapper = mapper; }

    public async Task<IEnumerable<InvoiceDto>> GetAllAsync()
    {
        var invoices = await _ctx.Invoices
            .Include(i => i.Client)
            .Include(i => i.Items)
            .Include(i => i.Payments)
            .OrderByDescending(i => i.CreatedAt)
            .ToListAsync();
        return invoices.Select(MapToDto);
    }

    public async Task<InvoiceDto?> GetByIdAsync(int id)
    {
        var inv = await _ctx.Invoices
            .Include(i => i.Client)
            .Include(i => i.Items)
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.Id == id);
        return inv == null ? null : MapToDto(inv);
    }

    public async Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto)
    {
        var count = await _ctx.Invoices.CountAsync();
        var invoice = new Invoice
        {
            InvoiceNumber = $"INV-{DateTime.UtcNow.Year}-{(count + 1):D4}",
            ClientId = dto.ClientId,
            InvoiceDate = dto.InvoiceDate,
            DueDate = dto.DueDate,
            Currency = dto.Currency,
            TaxRate = dto.TaxRate,
            DiscountAmount = dto.DiscountAmount,
            Notes = dto.Notes,
            Terms = dto.Terms,
            Status = InvoiceStatus.Draft,
            Items = dto.Items.Select(i => new InvoiceItem
            {
                Description = i.Description,
                Quantity = i.Quantity,
                Unit = i.Unit,
                UnitPrice = i.UnitPrice,
                Discount = i.Discount
            }).ToList()
        };
        invoice.SubTotal = invoice.Items.Sum(i => (i.Quantity * i.UnitPrice) - i.Discount);
        invoice.TaxAmount = Math.Round(invoice.SubTotal * (dto.TaxRate / 100), 2);
        invoice.TotalAmount = invoice.SubTotal + invoice.TaxAmount - dto.DiscountAmount;
        _ctx.Invoices.Add(invoice);
        await _ctx.SaveChangesAsync();
        return (await GetByIdAsync(invoice.Id))!;
    }

    public async Task<InvoiceDto?> UpdateAsync(int id, CreateInvoiceDto dto)
    {
        var inv = await _ctx.Invoices.Include(i => i.Items).FirstOrDefaultAsync(i => i.Id == id);
        if (inv == null) return null;
        inv.ClientId = dto.ClientId;
        inv.InvoiceDate = dto.InvoiceDate;
        inv.DueDate = dto.DueDate;
        inv.Currency = dto.Currency;
        inv.TaxRate = dto.TaxRate;
        inv.DiscountAmount = dto.DiscountAmount;
        inv.Notes = dto.Notes;
        inv.Terms = dto.Terms;
        _ctx.InvoiceItems.RemoveRange(inv.Items);
        inv.Items = dto.Items.Select(i => new InvoiceItem
        {
            Description = i.Description, Quantity = i.Quantity,
            Unit = i.Unit, UnitPrice = i.UnitPrice, Discount = i.Discount
        }).ToList();
        inv.SubTotal = inv.Items.Sum(i => (i.Quantity * i.UnitPrice) - i.Discount);
        inv.TaxAmount = Math.Round(inv.SubTotal * (dto.TaxRate / 100), 2);
        inv.TotalAmount = inv.SubTotal + inv.TaxAmount - dto.DiscountAmount;
        await _ctx.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var inv = await _ctx.Invoices.FindAsync(id);
        if (inv == null) return false;
        _ctx.Invoices.Remove(inv);
        await _ctx.SaveChangesAsync();
        return true;
    }

    public async Task<InvoiceDto?> UpdateStatusAsync(int id, string status)
    {
        var inv = await _ctx.Invoices.FindAsync(id);
        if (inv == null) return null;
        if (Enum.TryParse<InvoiceStatus>(status, true, out var s)) inv.Status = s;
        await _ctx.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync()
    {
        var invoices = await _ctx.Invoices.Include(i => i.Payments).ToListAsync();
        var now = DateTime.UtcNow;
        // Auto-update overdue
        foreach (var inv in invoices.Where(i => i.DueDate < now && i.Status == InvoiceStatus.Sent))
            inv.Status = InvoiceStatus.Overdue;
        await _ctx.SaveChangesAsync();

        var monthly = Enumerable.Range(0, 6).Select(i => {
            var m = now.AddMonths(-i);
            var monthInvs = invoices.Where(inv => inv.InvoiceDate.Month == m.Month && inv.InvoiceDate.Year == m.Year);
            return new MonthlyRevenueDto
            {
                Month = m.ToString("MMM yyyy"),
                Revenue = monthInvs.Sum(inv => inv.PaidAmount),
                Outstanding = monthInvs.Sum(inv => inv.BalanceDue)
            };
        }).Reverse().ToList();

        return new DashboardStatsDto
        {
            TotalRevenue = invoices.Sum(i => i.PaidAmount),
            OutstandingAmount = invoices.Where(i => i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled).Sum(i => i.BalanceDue),
            OverdueAmount = invoices.Where(i => i.Status == InvoiceStatus.Overdue).Sum(i => i.BalanceDue),
            TotalClients = await _ctx.Clients.CountAsync(),
            TotalInvoices = invoices.Count,
            PaidInvoices = invoices.Count(i => i.Status == InvoiceStatus.Paid),
            OverdueInvoices = invoices.Count(i => i.Status == InvoiceStatus.Overdue),
            DraftInvoices = invoices.Count(i => i.Status == InvoiceStatus.Draft),
            MonthlyRevenue = monthly
        };
    }

    private static InvoiceDto MapToDto(Invoice i) => new()
    {
        Id = i.Id, InvoiceNumber = i.InvoiceNumber, ClientId = i.ClientId,
        ClientName = i.Client?.Name ?? "", ClientEmail = i.Client?.Email ?? "",
        InvoiceDate = i.InvoiceDate, DueDate = i.DueDate, Status = i.Status.ToString(),
        Currency = i.Currency, SubTotal = i.SubTotal, TaxRate = i.TaxRate,
        TaxAmount = i.TaxAmount, DiscountAmount = i.DiscountAmount,
        TotalAmount = i.TotalAmount, PaidAmount = i.PaidAmount,
        BalanceDue = i.BalanceDue, Notes = i.Notes, Terms = i.Terms,
        CreatedAt = i.CreatedAt,
        Items = i.Items?.Select(ii => new InvoiceItemDto
        {
            Id = ii.Id, Description = ii.Description, Quantity = ii.Quantity,
            Unit = ii.Unit, UnitPrice = ii.UnitPrice, Discount = ii.Discount,
            Amount = (ii.Quantity * ii.UnitPrice) - ii.Discount
        }).ToList() ?? new(),
        Payments = i.Payments?.Select(p => new PaymentDto
        {
            Id = p.Id, InvoiceId = p.InvoiceId, Amount = p.Amount,
            PaymentDate = p.PaymentDate, Method = p.Method.ToString(),
            ReferenceNumber = p.ReferenceNumber, Notes = p.Notes
        }).ToList() ?? new()
    };
}
