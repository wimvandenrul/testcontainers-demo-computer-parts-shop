namespace Application.Interfaces;

public interface IMapper
{
    ProductDto ToDto(Product product);
    Product ToEntity(CreateProductDto dto);
    CategoryDto ToCategoryDto(Category category);
}
