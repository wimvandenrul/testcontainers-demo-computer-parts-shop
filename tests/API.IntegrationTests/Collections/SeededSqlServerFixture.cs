using Infrastructure;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Respawn;
using System.Diagnostics;
using Testcontainers.MsSql;

namespace Api.IntegrationTests.Collections
{
    public sealed class SeededSqlServerFixture : IAsyncLifetime
    {
        private string _connectionString;
        private MsSqlContainer _sqlContainer;

        private ShopContext _dbContext;
        private Respawner _respawner;
        private CustomWebApplicationFactory _factory;

        public HttpClient HttpClient { get; set; }

        public async Task InitializeAsync()
        {
            Debug.WriteLine("Starting SQL Server container...");

            _sqlContainer = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2025-latest")
                                    .WithPassword("YourStrongP@ssword123456789")
                                    .WithCleanUp(true)
                                    .Build();

            await _sqlContainer.StartAsync();
            _connectionString = _sqlContainer.GetConnectionString();

            _factory = new CustomWebApplicationFactory(_connectionString);
            HttpClient = _factory.CreateClient();

            var services = new ServiceCollection();
            services.AddDbContext<ShopContext>(options => options.UseSqlServer(_connectionString));

            var serviceProvider = services.BuildServiceProvider();
            _dbContext = serviceProvider.GetRequiredService<ShopContext>();

            await CreateDatabase();
            await InitializeRespawner();
            await SeedOnceAsync();
        }

        private async Task InitializeRespawner()
        {
            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                _respawner = await Respawner.CreateAsync(conn);
            }
        }

        private async Task CreateDatabase()
        {
            await _dbContext.Database.EnsureCreatedAsync();
        }

        private async Task SeedOnceAsync()
        {
            if (await _dbContext.Categories.AnyAsync() || await _dbContext.Products.AnyAsync())
            {
                return;
            }

            var seedFile = Path.Combine(AppContext.BaseDirectory, "DB-SEED-ONLY.sql");
            var sql = await File.ReadAllTextAsync(seedFile);
            await _dbContext.Database.ExecuteSqlRawAsync(sql);
        }

        public async Task ResetDatabaseAsync()
        {
            Debug.WriteLine("Resetting database to baseline seed");

            using (var conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();
                await _respawner.ResetAsync(conn);
            }

            await SeedOnceAsync();
        }

        public async Task DisposeAsync()
        {
            Debug.WriteLine("Removing SQL Server container...");
            if (_sqlContainer != null) await _sqlContainer.DisposeAsync();

            if (_factory != null) await _factory.DisposeAsync();
            if (_dbContext != null) await _dbContext.DisposeAsync();
            if (HttpClient != null) HttpClient.Dispose();
        }
    }
}
