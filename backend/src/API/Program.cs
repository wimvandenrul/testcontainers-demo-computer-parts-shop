using Application;
using Domain.Entities;
using Infrastructure;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Respawn;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddConsole();

builder.Services.AddHealthChecks();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});



var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");

app.MapGet("/test/seed-db", async (ShopContext context) =>
{
    await context.Database.EnsureCreatedAsync();

    var countCategories = await context.Categories.CountAsync();
    var countProducts = await context.Products.CountAsync();

    if (countCategories > 0 || countProducts > 0)
    {
        return Results.BadRequest("Database already contains data. Please reset the database before seeding.");
    }

    var seedSqlScript = File.ReadAllText("TestContainers/DB-SEED-ONLY.sql");
    await context.Database.ExecuteSqlRawAsync(seedSqlScript);
    return Results.Ok();
});

var _lock = new SemaphoreSlim(1, 1);
app.MapGet("/test/reset-db", async (IConfiguration config, ShopContext context) =>
{
    await _lock.WaitAsync();
    try
    {
        Console.WriteLine("Resetting database...");

        await context.Database.EnsureCreatedAsync();

        var connStr = config.GetConnectionString("DefaultConnection");

        using var conn = new SqlConnection(connStr);
        await conn.OpenAsync();

        var respawner = await Respawner.CreateAsync(conn);

        await respawner.ResetAsync(conn);

        var seedSqlScript = await File.ReadAllTextAsync("TestContainers/DB-SEED-ONLY.sql");
        await context.Database.ExecuteSqlRawAsync(seedSqlScript);

        // ADD STABILIZATION DELAY
        await Task.Delay(10000);

        return Results.Ok();
    }
    finally
    {
        _lock.Release();
    }
});


app.Run();
