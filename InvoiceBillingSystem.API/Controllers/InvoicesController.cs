using InvoiceBillingSystem.API.DTOs;
using InvoiceBillingSystem.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceBillingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InvoicesController : ControllerBase
{
    private readonly IInvoiceService _svc;
    public InvoicesController(IInvoiceService svc) => _svc = svc;

    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await _svc.GetAllAsync());
    [HttpGet("{id}")] public async Task<IActionResult> GetById(int id)
    {
        var inv = await _svc.GetByIdAsync(id);
        return inv == null ? NotFound() : Ok(inv);
    }
    [HttpGet("dashboard")] public async Task<IActionResult> Dashboard() => Ok(await _svc.GetDashboardStatsAsync());
    [HttpPost] public async Task<IActionResult> Create([FromBody] CreateInvoiceDto dto)
    {
        var inv = await _svc.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = inv.Id }, inv);
    }
    [HttpPut("{id}")] public async Task<IActionResult> Update(int id, [FromBody] CreateInvoiceDto dto)
    {
        var inv = await _svc.UpdateAsync(id, dto);
        return inv == null ? NotFound() : Ok(inv);
    }
    [HttpPatch("{id}/status")] public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var inv = await _svc.UpdateStatusAsync(id, status);
        return inv == null ? NotFound() : Ok(inv);
    }
    [HttpDelete("{id}"), Authorize(Roles = "Admin")] public async Task<IActionResult> Delete(int id)
    {
        return await _svc.DeleteAsync(id) ? NoContent() : NotFound();
    }
}
