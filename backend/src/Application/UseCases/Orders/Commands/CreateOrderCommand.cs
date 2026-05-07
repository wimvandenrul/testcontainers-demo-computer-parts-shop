using Application.Interfaces;
using Domain.DTOs;
using Domain.Entities;

namespace Application.UseCases.Orders.Commands;

public class CreateOrderCommand
{
    private readonly IOrderRepository _repository;
    private readonly IProductRepository _productRepository;

    public CreateOrderCommand(IOrderRepository repository, IProductRepository productRepository)
    {
        _repository = repository;
        _productRepository = productRepository;
    }

    public async Task<OrderDto> ExecuteAsync(CreateOrderDto dto, CancellationToken cancellationToken = default)
    {
        // Fetch all products to get names and prices
        var allProducts = await _productRepository.GetAllAsync(cancellationToken);
        var productMap = allProducts.ToDictionary(p => p.Id, p => p);

        // Create order items with product details from DB
        var orderItems = new List<OrderItem>();
        decimal total = 0;

        foreach (var itemDto in dto.Items)
        {
            if (!productMap.TryGetValue(itemDto.ProductId, out var product))
            {
                throw new InvalidOperationException($"Product with id {itemDto.ProductId} not found");
            }

            var orderItem = new OrderItem
            {
                ProductId = itemDto.ProductId,
                ProductName = product.Name,
                ProductPrice = product.Price,
                Quantity = itemDto.Quantity
            };

            orderItems.Add(orderItem);
            total += product.Price * itemDto.Quantity;
        }

        // Create the order entity
        var order = new Order
        {
            OrderId = $"{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            CreatedAt = DateTime.UtcNow,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Address = dto.Address,
            City = dto.City,
            ZipCode = dto.ZipCode,
            Country = dto.Country,
            Total = total,
            Items = orderItems
        };

        var savedOrder = await _repository.AddAsync(order, cancellationToken);
        return MapToDto(savedOrder);
    }

    private OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            OrderId = order.OrderId,
            CreatedAt = order.CreatedAt,
            Total = order.Total,
            FirstName = order.FirstName,
            LastName = order.LastName,
            Email = order.Email,
            Address = order.Address,
            City = order.City,
            ZipCode = order.ZipCode,
            Country = order.Country,
            Items = order.Items.Select(oi => new OrderItemDto
            {
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                ProductPrice = oi.ProductPrice,
                Quantity = oi.Quantity
            }).ToList()
        };
    }
}

