namespace Domain.Entities;

public class Order
{
    public int Id { get; set; }
    public string OrderId { get; set; } = string.Empty; // ORD-{timestamp}
    public DateTime CreatedAt { get; set; }
    public decimal Total { get; set; }

    // Customer Information
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;

    // Navigation
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
