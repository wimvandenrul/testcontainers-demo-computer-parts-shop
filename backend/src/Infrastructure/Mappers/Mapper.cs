using Application.Interfaces;
using Domain.DTOs;
using Domain;
using Domain.Entities;

namespace Infrastructure.Mappers;

public class Mapper : IMapper
{
    public ProductDto ToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Category = new CategoryDto()
            {
                Id = product.Category.Id,
                Name = product.Category.Name,
                Description = product.Category.Description
            },
            Image = product.Image
        };
    }

    public Product ToEntity(CreateProductDto dto)
    {
        return new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            CategoryId = dto.CategoryId,
            Image = $"/assets/images/{dto.CategoryId.ToString().ToLower()}-{Guid.NewGuid():N}.png"
        };
    }

    public CategoryDto ToCategoryDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name
        };
    }
}
