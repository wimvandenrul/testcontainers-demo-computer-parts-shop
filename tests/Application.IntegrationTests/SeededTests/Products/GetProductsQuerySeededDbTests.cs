using Application.IntegrationTests.Collections;
using Application.UseCases.Products.Queries;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace Application.IntegrationTests.SeededTests.Products
{
    [Collection("Seeded SQL Server")]
    public class GetProductsQuerySeededDbTests
    {
        private readonly SeededSqlServerFixture _fixture;

        public GetProductsQuerySeededDbTests(SeededSqlServerFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAll_WhenDatabaseIsSeeded_ReturnsAllProducts()
        {
            await _fixture.ResetDatabaseAsync();

            Debug.WriteLine("Running GetAll_WhenDatabaseIsSeeded_ReturnsAllProducts test...");

            await using (var scope = _fixture.ServiceProvider.CreateAsyncScope())
            {
                var query = scope.ServiceProvider.GetRequiredService<GetProductsQuery>();
                var products = await query.ExecuteAsync();

                Assert.NotNull(products);
                Assert.Equal(28, products.Count);
            }
        }
    }
}
