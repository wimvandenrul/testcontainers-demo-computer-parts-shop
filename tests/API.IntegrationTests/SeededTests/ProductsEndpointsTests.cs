using Api.IntegrationTests.Collections;
using Domain.DTOs;
using System.Net.Http.Json;

namespace Api.IntegrationTests.SeededTests
{
    [Collection("Seeded SQL Server")]
    public sealed class ProductsEndpointsTests : IAsyncLifetime
    {
        private readonly SeededSqlServerFixture _fixture;
        private CustomWebApplicationFactory _factory;
        private HttpClient _client;

        public ProductsEndpointsTests(SeededSqlServerFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAll_ReturnsSeededProducts()
        {
            var response = await _client.GetAsync("/api/products");

            response.EnsureSuccessStatusCode();

            var products = await response.Content.ReadFromJsonAsync<List<ProductDto>>();

            Assert.NotNull(products);
            Assert.Equal(28, products.Count);
        }

        [Fact]
        public async Task GetById_ReturnsSeededProduct()
        {
            var response = await _client.GetAsync("/api/products/1");
            response.EnsureSuccessStatusCode();
            var product = await response.Content.ReadFromJsonAsync<ProductDto>();
            Assert.NotNull(product);
            Assert.Equal(1, product.Id);
            Assert.Equal("AMD Ryzen 9 7950X", product.Name);
            Assert.Equal("16-core, 32-thread desktop processor with 5.7 GHz max boost, 170W TDP", product.Description);
            Assert.Equal(549.99M, product.Price);
            Assert.Equal("Cpu", product.Category.Name);
            Assert.Equal("Processors", product.Category.Description);
        }

        public async Task InitializeAsync()
        {
            var appConnectionString = _fixture.GetApplicationConnectionString();

            _factory = new CustomWebApplicationFactory(appConnectionString);

            _client = _factory.CreateClient();
        }

        public async Task DisposeAsync()
        {
            _client.Dispose();
            await _factory.DisposeAsync();
        }
    }
}
