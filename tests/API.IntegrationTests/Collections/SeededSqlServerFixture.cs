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
        private readonly MsSqlContainer _sqlContainer;
        private Respawner _respawner = null;

        private ServiceProvider _serviceProvider = null;
        private ShopContext _dbContext = null;

        public string ConnectionString { get; private set; }

        public SeededSqlServerFixture()
        {
            _sqlContainer = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2025-latest")
                .WithPassword("YourStrongP@ssword123456789")
                .WithCleanUp(true)
                .Build();
        }

        public string GetApplicationConnectionString()
        {
            return ConnectionString;
        }

        public async Task InitializeAsync()
        {
            Debug.WriteLine("Starting SQL Server container...");

            await _sqlContainer.StartAsync();
            ConnectionString = _sqlContainer.GetConnectionString();

            var services = new ServiceCollection();
            services.AddDbContext<ShopContext>(options => options.UseSqlServer(ConnectionString));

            _serviceProvider = services.BuildServiceProvider();
            _dbContext = _serviceProvider.GetRequiredService<ShopContext>();

            await CreateDatabase();
            await InitializeRespawner();
            await SeedOnceAsync();
        }

        private async Task InitializeRespawner()
        {
            using (var conn = new SqlConnection(ConnectionString))
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

            using (var conn = new SqlConnection(ConnectionString))
            {
                await conn.OpenAsync();
                await _respawner.ResetAsync(conn);
            }

            await SeedOnceAsync();
        }

        public async Task DisposeAsync()
        {
            Debug.WriteLine("Removing SQL Server container...");

            await _sqlContainer.DisposeAsync();
        }

    }
}
