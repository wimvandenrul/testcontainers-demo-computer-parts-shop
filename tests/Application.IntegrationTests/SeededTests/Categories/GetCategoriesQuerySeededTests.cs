using Application.IntegrationTests.Collections;
using Application.UseCases.Categories.Queries;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace Application.IntegrationTests.SeededTests.Categories
{
    [Collection("Seeded SQL Server")]
    public class GetCategoriesQuerySeededTests
    {
        private readonly SeededSqlServerFixture _fixture;

        public GetCategoriesQuerySeededTests(SeededSqlServerFixture fixture)
        {
            _fixture = fixture;
        }

        [Fact]
        public async Task GetAll_WhenDatabaseIsSeeded_ReturnsAllSeededCategories()
        {
            Debug.WriteLine("Running GetAll_WhenDatabaseIsSeeded_ReturnsAllSeededCategories test...");

            await using (var scope = _fixture.ServiceProvider.CreateAsyncScope())
            {
                var query = scope.ServiceProvider.GetRequiredService<GetCategoriesQuery>();
                var categories = await query.ExecuteAsync();

                Assert.NotNull(categories);
                Assert.Equal(8, categories.Count);
                Assert.Contains(categories, c => c.Id == 1 && c.Name == "Cpu");
                Assert.Contains(categories, c => c.Id == 8 && c.Name == "Cooling");
            }
        }
    }
}
