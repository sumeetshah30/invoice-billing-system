namespace InvoiceBillingSystem.API.Models;

public class InvoiceItem
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }
    public Invoice Invoice { get; set; } = null!;
    public string Description { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = "hrs";
    public decimal UnitPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal Amount => (Quantity * UnitPrice) - Discount;
}
