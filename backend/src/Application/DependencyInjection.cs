using Application.UseCases.Products.Commands;
using Application.UseCases.Products.Queries;
using Application.UseCases.Categories.Queries;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<GetProductsQuery>();
        services.AddScoped<CreateProductCommand>();
        services.AddScoped<UpdateProductCommand>();
        services.AddScoped<DeleteProductCommand>();
        services.AddScoped<GetCategoriesQuery>();
        return services;
    }
}
