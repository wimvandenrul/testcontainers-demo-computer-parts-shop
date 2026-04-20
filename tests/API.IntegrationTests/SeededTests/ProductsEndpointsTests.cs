using Api.IntegrationTests.Collections;
using Domain.DTOs;
using System.Net;
using System.Net.Http.Json;

namespace Api.IntegrationTests.SeededTests
{
    [Collection("Seeded SQL Server")]
    public sealed class ProductsEndpointsTests : IAsyncLifetime
    {
        private readonly SeededSqlServerFixture _fixture;

        public ProductsEndpointsTests(SeededSqlServerFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAll_ReturnsSeededProducts()
        {
            // Act
            var response = await _fixture.HttpClient.GetAsync("/api/products");

            // Assert
            response.EnsureSuccessStatusCode();
            var products = await response.Content.ReadFromJsonAsync<List<ProductDto>>();
            Assert.NotNull(products);
            Assert.Equal(28, products.Count);
        }

        [Fact]
        public async Task GetById_ReturnsSeededProduct()
        {
            // Act
            var response = await _fixture.HttpClient.GetAsync("/api/products/1");
            response.EnsureSuccessStatusCode();

            // Assert
            var product = await response.Content.ReadFromJsonAsync<ProductDto>();
            Assert.NotNull(product);
            Assert.Equal(1, product.Id);
            Assert.Equal("AMD Ryzen 9 7950X", product.Name);
            Assert.Equal("16-core, 32-thread desktop processor with 5.7 GHz max boost, 170W TDP", product.Description);
            Assert.Equal(549.99M, product.Price);
            Assert.Equal("Cpu", product.Category.Name);
            Assert.Equal("Processors", product.Category.Description);
        }

        [Fact]
        public async Task CreateProduct_ReturnsCreatedProduct()
        {
            var createProductDto = new CreateProductDto
            {
                Name = "TEST 123456 CPU",
                Description = "TEST 123456 CPU - VERY GOOD CPU",
                Price = 900M,
                CategoryId = 1
            };

            // Act
            var response = await _fixture.HttpClient.PostAsJsonAsync("/api/products", createProductDto);

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            var product = await response.Content.ReadFromJsonAsync<ProductDto>();
            Assert.NotNull(product);
            Assert.True(product.Id > 0);
            Assert.Equal("TEST 123456 CPU", product.Name);
            Assert.Equal("TEST 123456 CPU - VERY GOOD CPU", product.Description);
            Assert.Equal(900M, product.Price);
            Assert.Equal("Cpu", product.Category.Name);
            Assert.Equal("Processors", product.Category.Description);
        }

        public async Task InitializeAsync()
        {
            await _fixture.ResetDatabaseAsync(); // can cause race conditions if tests are run in parallel, but since we disabled parallelization for this collection, it should be fine
        }

        public async Task DisposeAsync()
        {

        }
    }
}
