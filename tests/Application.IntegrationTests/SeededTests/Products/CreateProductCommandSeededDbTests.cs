using Application.IntegrationTests.Collections;
using Application.UseCases.Products.Commands;
using Domain.DTOs;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Application.IntegrationTests.SeededTests.Products
{
    [Collection("Seeded SQL Server")]
    public class CreateProductCommandSeededDbTests
    {
        private readonly SeededSqlServerFixture _fixture;

        public CreateProductCommandSeededDbTests(SeededSqlServerFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task Create_ShouldAddProduct()
        {
            await _fixture.ResetDatabaseAsync();

            await using var scope = _fixture.ServiceProvider.CreateAsyncScope();

            var command = scope.ServiceProvider.GetRequiredService<CreateProductCommand>();
            var dbContext = scope.ServiceProvider.GetRequiredService<ShopContext>();

            var category = await dbContext.Categories.FirstAsync();

            var dto = new CreateProductDto
            {
                Name = "Test CPU",
                Description = "Created by integration test",
                Price = 99.99m,
                CategoryId = category.Id
            };

            var created = await command.ExecuteAsync(dto);

            var productInDb = await dbContext.Products
                .Include(p => p.Category)
                .SingleOrDefaultAsync(p => p.Id == created.Id);

            Assert.NotNull(productInDb);
            Assert.Equal(dto.Name, productInDb.Name);
            Assert.Equal(dto.Description, productInDb.Description);
            Assert.Equal(dto.Price, productInDb.Price);
            Assert.Equal(dto.CategoryId, productInDb.CategoryId);

            var totalProductsInDb = await dbContext.Products.CountAsync();
            Assert.Equal(29, totalProductsInDb); // Assuming there were 28 products initially
        }

        [Fact]
        public async Task Create_100_Products_With_Same_Category()
        {
            await _fixture.ResetDatabaseAsync();

            await using var scope = _fixture.ServiceProvider.CreateAsyncScope();

            var command = scope.ServiceProvider.GetRequiredService<CreateProductCommand>();
            var dbContext = scope.ServiceProvider.GetRequiredService<ShopContext>();

            var category = await dbContext.Categories.FirstAsync();

            for (int i = 0; i < 100; i++)
            {
                var dto = new CreateProductDto
                {
                    Name = $"Test CPU {i + 1}",
                    Description = "Created by integration test",
                    Price = new Random().Next(50, 600),
                    CategoryId = category.Id
                };

                await command.ExecuteAsync(dto);
            }

            var totalProductsInDb = await dbContext.Products.CountAsync();
            Assert.Equal(128, totalProductsInDb); // Assuming there were 28 products initially
        }
    }
}
