using InvoiceBillingSystem.API.DTOs;

namespace InvoiceBillingSystem.API.Interfaces;

public interface IInvoiceService
{
    Task<IEnumerable<InvoiceDto>> GetAllAsync();
    Task<InvoiceDto?> GetByIdAsync(int id);
    Task<InvoiceDto> CreateAsync(CreateInvoiceDto dto);
    Task<InvoiceDto?> UpdateAsync(int id, CreateInvoiceDto dto);
    Task<bool> DeleteAsync(int id);
    Task<InvoiceDto?> UpdateStatusAsync(int id, string status);
    Task<DashboardStatsDto> GetDashboardStatsAsync();
}
