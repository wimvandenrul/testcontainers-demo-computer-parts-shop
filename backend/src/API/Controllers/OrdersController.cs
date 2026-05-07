using Application.UseCases.Orders.Commands;
using Application.UseCases.Orders.Queries;
using Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly CreateOrderCommand _createOrderCommand;
    private readonly GetOrdersQuery _getOrdersQuery;

    public OrdersController(CreateOrderCommand createOrderCommand, GetOrdersQuery getOrdersQuery)
    {
        _createOrderCommand = createOrderCommand;
        _getOrdersQuery = getOrdersQuery;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> GetAll(CancellationToken cancellationToken)
    {
        var orders = await _getOrdersQuery.ExecuteAsync(cancellationToken);
        return Ok(orders);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderDto dto, CancellationToken cancellationToken)
    {
        var order = await _createOrderCommand.ExecuteAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(Create), order);
    }
}
