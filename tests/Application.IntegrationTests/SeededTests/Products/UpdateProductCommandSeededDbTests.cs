using Application.IntegrationTests.Collections;
using Application.UseCases.Products.Commands;
using Domain.DTOs;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Application.IntegrationTests.SeededTests.Products
{
    [Collection("Seeded SQL Server")]
    public class UpdateProductCommandSeededDbTests
    {
        private readonly SeededSqlServerFixture _fixture;

        public UpdateProductCommandSeededDbTests(SeededSqlServerFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task Update_ShouldUpdateProduct()
        {
            await _fixture.ResetDatabaseAsync();

            await using var scope = _fixture.ServiceProvider.CreateAsyncScope();

            var command = scope.ServiceProvider.GetRequiredService<UpdateProductCommand>();
            var dbContext = scope.ServiceProvider.GetRequiredService<ShopContext>();

            var category = await dbContext.Categories.FirstAsync();

            var existingProduct = await dbContext.Products.SingleOrDefaultAsync(x=> x.Name.Contains("AMD Ryzen 9 7950X"));
            var existingProductId = existingProduct.Id;

            var dto = new UpdateProductDto
            {
                Name = "AMD Ryzen 9 7950X",
                Description = "Very powerful CPU",
                Price = 999.999m,
                CategoryId = category.Id
            };

            var updated = await command.ExecuteAsync(existingProductId, dto);

            var productInDb = await dbContext.Products
                .Include(p => p.Category)
                .SingleOrDefaultAsync(p => p.Id == updated.Id);

            Assert.NotNull(productInDb);
            Assert.Equal("AMD Ryzen 9 7950X", productInDb.Name);
            Assert.Equal("Very powerful CPU", productInDb.Description);
            Assert.Equal(999.999M, productInDb.Price);
            Assert.Equal(1, productInDb.CategoryId);

            var totalProductsInDb = await dbContext.Products.CountAsync();
            Assert.Equal(28, totalProductsInDb); // Assuming there were 28 products initially
        }
    }
}
