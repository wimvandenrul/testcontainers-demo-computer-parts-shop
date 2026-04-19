using Infrastructure;
using Infrastructure.Mappers;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.MsSql;

namespace Application.IntegrationTests;

public sealed class SqlServerFixture : IAsyncLifetime
{
    private readonly MsSqlContainer _sqlContainer;

    public ServiceProvider ServiceProvider { get; private set; } = default!;
    public ShopContext DbContext { get; private set; } = default!;

    public SqlServerFixture()
    {
        _sqlContainer = new MsSqlBuilder("mcr.microsoft.com/mssql/server:2025-latest")
            .WithPassword("YourStrongP@ssword123456789")
            .WithCleanUp(true)
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _sqlContainer.StartAsync();

        var services = new ServiceCollection();

        services.AddDbContext<ShopContext>(options =>
            options.UseSqlServer(_sqlContainer.GetConnectionString()));

        services.AddApplication();
        services.AddScoped<Application.Interfaces.IProductRepository, ProductRepository>();
        services.AddScoped<Application.Interfaces.ICategoryRepository, CategoryRepository>();
        services.AddSingleton<Application.Interfaces.IMapper, Mapper>();

        ServiceProvider = services.BuildServiceProvider();
        DbContext = ServiceProvider.GetRequiredService<ShopContext>();

        await DbContext.Database.EnsureCreatedAsync();
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