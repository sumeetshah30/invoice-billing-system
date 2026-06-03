using InvoiceBillingSystem.API.DTOs;

namespace InvoiceBillingSystem.API.Interfaces;

public interface IClientService
{
    Task<IEnumerable<ClientDto>> GetAllAsync();
    Task<ClientDto?> GetByIdAsync(int id);
    Task<ClientDto> CreateAsync(CreateClientDto dto);
    Task<ClientDto?> UpdateAsync(int id, CreateClientDto dto);
    Task<bool> DeleteAsync(int id);
}
