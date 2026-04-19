using Application.Interfaces;
using Domain.DTOs;

namespace Application.UseCases.Categories.Queries;

public class GetCategoriesQuery
{
    private readonly ICategoryRepository _repository;
    private readonly IMapper _mapper;

    public GetCategoriesQuery(ICategoryRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<CategoryDto>> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var categories = await _repository.GetAllAsync(cancellationToken);
        return categories.Select(_mapper.ToCategoryDto).ToList();
    }
}
