using Application.Interfaces;
using Domain.DTOs;

namespace Application.UseCases.Products.Commands;

public class UpdateProductCommand
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IProductRepository _productRepository;
    private readonly IMapper _mapper;

    public UpdateProductCommand(IProductRepository repository, IMapper mapper)
    {
        _productRepository = repository;
        _mapper = mapper;
    }

    public async Task<ProductDto?> ExecuteAsync(int id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);
        if (product == null)
            return null;

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.CategoryId = dto.CategoryId;

        await _productRepository.UpdateAsync(product, cancellationToken);
        return _mapper.ToDto(product);
    }
}
