using Application.UseCases.Products.Commands;
using Application.UseCases.Products.Queries;
using Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly GetProductsQuery _getProductsQuery;
    private readonly CreateProductCommand _createProductCommand;
    private readonly UpdateProductCommand _updateProductCommand;
    private readonly DeleteProductCommand _deleteProductCommand;

    public ProductsController(
        GetProductsQuery getProductsQuery,
        CreateProductCommand createProductCommand,
        UpdateProductCommand updateProductCommand,
        DeleteProductCommand deleteProductCommand)
    {
        _getProductsQuery = getProductsQuery;
        _createProductCommand = createProductCommand;
        _updateProductCommand = updateProductCommand;
        _deleteProductCommand = deleteProductCommand;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ProductDto>>> GetAll(CancellationToken cancellationToken)
    {
        var products = await _getProductsQuery.ExecuteAsync(cancellationToken);
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var products = await _getProductsQuery.ExecuteAsync(cancellationToken);
        var product = products.FirstOrDefault(p => p.Id == id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductDto dto, CancellationToken cancellationToken)
    {
        var product = await _createProductCommand.ExecuteAsync(dto, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ProductDto>> Update(int id, UpdateProductDto dto, CancellationToken cancellationToken)
    {
        var product = await _updateProductCommand.ExecuteAsync(id, dto, cancellationToken);
        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var success = await _deleteProductCommand.ExecuteAsync(id, cancellationToken);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
