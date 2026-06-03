using InvoiceBillingSystem.API.Data;
using InvoiceBillingSystem.API.DTOs;
using InvoiceBillingSystem.API.Interfaces;
using InvoiceBillingSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvoiceBillingSystem.API.Services;

public class ClientService : IClientService
{
    private readonly AppDbContext _ctx;
    public ClientService(AppDbContext ctx) => _ctx = ctx;

    public async Task<IEnumerable<ClientDto>> GetAllAsync()
    {
        var clients = await _ctx.Clients.Include(c => c.Invoices).ThenInclude(i => i.Payments).ToListAsync();
        return clients.Select(MapToDto);
    }

    public async Task<ClientDto?> GetByIdAsync(int id)
    {
        var c = await _ctx.Clients.Include(c => c.Invoices).ThenInclude(i => i.Payments).FirstOrDefaultAsync(c => c.Id == id);
        return c == null ? null : MapToDto(c);
    }

    public async Task<ClientDto> CreateAsync(CreateClientDto dto)
    {
        var client = new Client
        {
            Name = dto.Name, Email = dto.Email, Phone = dto.Phone,
            Address = dto.Address, City = dto.City, Country = dto.Country,
            GSTNumber = dto.GSTNumber, Currency = dto.Currency
        };
        _ctx.Clients.Add(client);
        await _ctx.SaveChangesAsync();
        return MapToDto(client);
    }

    public async Task<ClientDto?> UpdateAsync(int id, CreateClientDto dto)
    {
        var client = await _ctx.Clients.FindAsync(id);
        if (client == null) return null;
        client.Name = dto.Name; client.Email = dto.Email; client.Phone = dto.Phone;
        client.Address = dto.Address; client.City = dto.City; client.Country = dto.Country;
        client.GSTNumber = dto.GSTNumber; client.Currency = dto.Currency;
        await _ctx.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var client = await _ctx.Clients.FindAsync(id);
        if (client == null) return false;
        client.IsActive = false;
        await _ctx.SaveChangesAsync();
        return true;
    }

    private static ClientDto MapToDto(Client c) => new()
    {
        Id = c.Id, Name = c.Name, Email = c.Email, Phone = c.Phone,
        Address = c.Address, City = c.City, Country = c.Country,
        GSTNumber = c.GSTNumber, Currency = c.Currency,
        IsActive = c.IsActive, CreatedAt = c.CreatedAt,
        TotalInvoices = c.Invoices?.Count ?? 0,
        TotalRevenue = c.Invoices?.Sum(i => i.PaidAmount) ?? 0,
        OutstandingBalance = c.Invoices?.Where(i => i.Status != InvoiceStatus.Paid && i.Status != InvoiceStatus.Cancelled).Sum(i => i.BalanceDue) ?? 0
    };
}
