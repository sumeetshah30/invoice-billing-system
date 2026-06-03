using InvoiceBillingSystem.API.Models;
using Microsoft.EntityFrameworkCore;

namespace InvoiceBillingSystem.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<InvoiceItem> InvoiceItems => Set<InvoiceItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Invoice>()
            .HasOne(i => i.Client).WithMany(c => c.Invoices)
            .HasForeignKey(i => i.ClientId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<InvoiceItem>()
            .HasOne(ii => ii.Invoice).WithMany(i => i.Items)
            .HasForeignKey(ii => ii.InvoiceId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Invoice).WithMany(i => i.Payments)
            .HasForeignKey(p => p.InvoiceId).OnDelete(DeleteBehavior.Cascade);
    }
}
