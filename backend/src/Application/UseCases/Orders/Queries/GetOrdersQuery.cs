using Application.Interfaces;
using Domain.DTOs;
using Domain.Entities;

namespace Application.UseCases.Orders.Queries;

public class GetOrdersQuery
{
    private readonly IOrderRepository _repository;

    public GetOrdersQuery(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<OrderDto>> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var orders = await _repository.GetAllAsync(cancellationToken);
        return orders.Select(MapToDto).ToList();
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
