using Application.Interfaces;
using Domain.DTOs;

namespace Application.UseCases.Products.Commands;

public class CreateProductCommand
{
    private readonly IProductRepository _repository;
    private readonly IMapper _mapper;

    public CreateProductCommand(IProductRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<ProductDto> ExecuteAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = _mapper.ToEntity(dto);
        var created = await _repository.AddAsync(product, cancellationToken);
        return _mapper.ToDto(created);
    }
}
