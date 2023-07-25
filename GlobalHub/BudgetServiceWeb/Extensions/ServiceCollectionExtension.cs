using BudgetBusinessLayer.Services.Interfaces;
using BudgetDataLayer.Repository;
using BudgetDataLayer.Repository.Interfaces;

namespace BudgetService.Extensions;

public static class ServiceCollectionExtension
{
    public static IServiceCollection RegisterRepositories(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IBudgetRepository, BudgetRepository>();

        return serviceCollection;
    }

    public static IServiceCollection RegisterServices(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IBudgetService, BudgetBusinessLayer.Services.BudgetService>();

        return serviceCollection;
    }
}
