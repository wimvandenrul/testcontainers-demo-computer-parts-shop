using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.ToTable("order");

            builder.HasKey(o => o.Id);

            builder.Property(o => o.OrderId)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(o => o.FirstName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(o => o.LastName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(o => o.Email)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(o => o.Address)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(o => o.City)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(o => o.ZipCode)
                   .IsRequired()
                   .HasMaxLength(20);

            builder.Property(o => o.Country)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(o => o.Total)
                   .HasPrecision(18, 2);

            builder.HasMany(o => o.Items)
                   .WithOne(oi => oi.Order)
                   .HasForeignKey(oi => oi.OrderId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
    {
        public void Configure(EntityTypeBuilder<OrderItem> builder)
        {
            builder.ToTable("order_item");

            builder.HasKey(oi => oi.Id);

            builder.Property(oi => oi.ProductName)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(oi => oi.ProductPrice)
                   .HasPrecision(18, 2);

            builder.HasOne(oi => oi.Order)
                   .WithMany(o => o.Items)
                   .HasForeignKey(oi => oi.OrderId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(oi => oi.Product)
                   .WithMany()
                   .HasForeignKey(oi => oi.ProductId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
