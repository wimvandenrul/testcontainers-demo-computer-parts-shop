using Application.UseCases.Categories.Queries;
using Domain.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly GetCategoriesQuery _getCategoriesQuery;

    public CategoriesController(GetCategoriesQuery getCategoriesQuery)
    {
        _getCategoriesQuery = getCategoriesQuery;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CategoryDto>>> GetAll(CancellationToken cancellationToken)
    {
        var categories = await _getCategoriesQuery.ExecuteAsync(cancellationToken);
        return Ok(categories);
    }
}
