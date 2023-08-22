using BudgetsService.Business.Services;
using BudgetsService.Business.Services.Interfaces;
using BudgetsService.DataAccess.Repository;
using BudgetsService.DataAccess.Repository.Interfaces;
using BudgetsService.Infrastructure.Services;
using BudgetsService.Infrastructure.Services.Interfaces;

namespace BudgetsService.Web.Extensions;

public static class ServiceCollectionExtension
{
    public static IServiceCollection RegisterRepositories(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IBudgetRepository, BudgetRepository>();
        serviceCollection.AddScoped<IBudgetItemRepository, BudgetItemRepository>();
        serviceCollection.AddScoped<ITagRepository, TagRepository>();

        return serviceCollection;
    }

    public static IServiceCollection RegisterServices(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IBudgetService, BudgetService>();
        serviceCollection.AddScoped<IBudgetItemService, BudgetItemService>();
        serviceCollection.AddScoped<ITagService, TagService>();
        serviceCollection.AddScoped<IDateTimeService, DateTimeService>();

        return serviceCollection;
    }
}
