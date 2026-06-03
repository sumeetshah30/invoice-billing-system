using InvoiceBillingSystem.API.DTOs;
using InvoiceBillingSystem.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceBillingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ClientsController : ControllerBase
{
    private readonly IClientService _svc;
    public ClientsController(IClientService svc) => _svc = svc;

    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await _svc.GetAllAsync());
    [HttpGet("{id}")] public async Task<IActionResult> GetById(int id)
    {
        var c = await _svc.GetByIdAsync(id);
        return c == null ? NotFound() : Ok(c);
    }
    [HttpPost] public async Task<IActionResult> Create([FromBody] CreateClientDto dto)
    {
        var c = await _svc.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
    }
    [HttpPut("{id}")] public async Task<IActionResult> Update(int id, [FromBody] CreateClientDto dto)
    {
        var c = await _svc.UpdateAsync(id, dto);
        return c == null ? NotFound() : Ok(c);
    }
    [HttpDelete("{id}")] public async Task<IActionResult> Delete(int id)
        => await _svc.DeleteAsync(id) ? NoContent() : NotFound();
}
