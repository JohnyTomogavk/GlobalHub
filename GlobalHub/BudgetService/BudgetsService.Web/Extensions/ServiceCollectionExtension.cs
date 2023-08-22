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
