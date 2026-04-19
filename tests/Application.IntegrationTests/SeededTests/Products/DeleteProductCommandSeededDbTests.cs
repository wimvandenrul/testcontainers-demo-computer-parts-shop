using Application.IntegrationTests.Collections;
using Application.UseCases.Products.Commands;
using Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Application.IntegrationTests.SeededTests.Products
{
    [Collection("Seeded SQL Server")]
    public class DeleteProductCommandSeededDbTests
    {
        private readonly SeededSqlServerFixture _fixture;

        public DeleteProductCommandSeededDbTests(SeededSqlServerFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task Delete_ShouldDeleteProduct()
        {
            await _fixture.ResetDatabaseAsync();

            await using var scope = _fixture.ServiceProvider.CreateAsyncScope();

            var command = scope.ServiceProvider.GetRequiredService<DeleteProductCommand>();
            var dbContext = scope.ServiceProvider.GetRequiredService<ShopContext>();
            
            var id = dbContext.Products.SingleOrDefault(x => x.Name.Contains("AMD Ryzen 9 7950X"))?.Id;
            if (id == null)
            {
                Assert.Fail("Product not found");
                return;
            }

            var deleted = await command.ExecuteAsync(id.Value);
            Assert.True(deleted);

            var totalProductsInDb = await dbContext.Products.CountAsync();
            Assert.Equal(27, totalProductsInDb); // Assuming there were 28 products initially
        }
    }
}
