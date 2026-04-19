using Infrastructure;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Respawn;
using System.Diagnostics;
using Testcontainers.MsSql;

namespace Application.IntegrationTests.Collections
{
    public sealed class SeededSqlServerFixture : IAsyncLifetime
    {
        private readonly MsSqlContainer _sqlContainer;
        private Respawner _respawner = null;

        public ServiceProvider ServiceProvider { get; private set; } = default!;
        public ShopContext DbContext { get; private set; } = default!;
        public string ConnectionString { get; private set; }

        public SeededSqlServerFixture()
        {
            _sqlContainer = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2025-latest")
                .WithPassword("YourStrongP@ssword123456789")
                .WithCleanUp(true)
                .Build();
        }

        public async Task InitializeAsync()
        {
            Debug.WriteLine("Starting SQL Server container...");

            await _sqlContainer.StartAsync();

            ConnectionString = _sqlContainer.GetConnectionString();

            var services = new ServiceCollection();
            var configuration = new ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string?>
                {
                    { "ConnectionStrings:DefaultConnection", ConnectionString }
                })
                .Build();

            services.AddApplication();
            services.AddInfrastructure(configuration);

            ServiceProvider = services.BuildServiceProvider();
            DbContext = ServiceProvider.GetRequiredService<ShopContext>();

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
            await DbContext.Database.EnsureCreatedAsync();
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
            if (DbContext is not null)
            {
                await DbContext.DisposeAsync();
            }

            if (ServiceProvider is not null)
            {
                await ServiceProvider.DisposeAsync();
            }

            Debug.WriteLine("Removing SQL Server container...");

            await _sqlContainer.DisposeAsync();
        }

        private async Task SeedOnceAsync()
        {
            if (await DbContext.Categories.AnyAsync()
                || await DbContext.Products.AnyAsync())
            {
                return;
            }

            var seedFile = Path.Combine(AppContext.BaseDirectory, "DB-SEED-ONLY.sql");
            var sql = await File.ReadAllTextAsync(seedFile);
            await DbContext.Database.ExecuteSqlRawAsync(sql);
        }
    }
}
