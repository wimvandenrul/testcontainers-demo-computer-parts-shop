using Application.Interfaces;
using Domain.DTOs;

namespace Application.UseCases.Products.Queries;

public class GetProductsQuery
{
    private readonly IProductRepository _repository;
    private readonly IMapper _mapper;

    public GetProductsQuery(IProductRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<IReadOnlyList<ProductDto>> ExecuteAsync(CancellationToken cancellationToken = default)
    {
        var products = await _repository.GetAllAsync(cancellationToken);
        return products.Select(_mapper.ToDto).ToList();
    }
}
