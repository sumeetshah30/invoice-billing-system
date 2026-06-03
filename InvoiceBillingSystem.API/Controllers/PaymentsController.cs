using InvoiceBillingSystem.API.Data;
using InvoiceBillingSystem.API.DTOs;
using InvoiceBillingSystem.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InvoiceBillingSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _ctx;
    public PaymentsController(AppDbContext ctx) => _ctx = ctx;

    [HttpGet] public async Task<IActionResult> GetAll()
    {
        var payments = await _ctx.Payments.Include(p => p.Invoice).OrderByDescending(p => p.CreatedAt).ToListAsync();
        return Ok(payments.Select(p => new PaymentDto
        {
            Id = p.Id, InvoiceId = p.InvoiceId,
            InvoiceNumber = p.Invoice?.InvoiceNumber ?? "",
            Amount = p.Amount, PaymentDate = p.PaymentDate,
            Method = p.Method.ToString(), ReferenceNumber = p.ReferenceNumber, Notes = p.Notes
        }));
    }

    [HttpPost] public async Task<IActionResult> Create([FromBody] CreatePaymentDto dto)
    {
        var invoice = await _ctx.Invoices.FindAsync(dto.InvoiceId);
        if (invoice == null) return NotFound("Invoice not found");

        if (!Enum.TryParse<PaymentMethod>(dto.Method, true, out var method))
            return BadRequest("Invalid payment method");

        var payment = new Payment
        {
            InvoiceId = dto.InvoiceId, Amount = dto.Amount,
            PaymentDate = dto.PaymentDate, Method = method,
            ReferenceNumber = dto.ReferenceNumber, Notes = dto.Notes
        };
        _ctx.Payments.Add(payment);
        invoice.PaidAmount += dto.Amount;
        invoice.Status = invoice.PaidAmount >= invoice.TotalAmount
            ? InvoiceStatus.Paid : InvoiceStatus.PartiallyPaid;
        await _ctx.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = payment.Id }, payment);
    }
}
