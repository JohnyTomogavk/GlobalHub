using Common.Services;

namespace BudgetsService.Web.Extensions;

public static class ServiceCollectionExtension
{
    public static IServiceCollection RegisterRepositories(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IBudgetRepository, BudgetRepository>();
        serviceCollection.AddScoped<IBudgetItemRepository, BudgetItemRepository>();
        serviceCollection.AddScoped<ITagRepository, TagRepository>();
        serviceCollection.AddScoped<ITagLimitRepository, TagLimitRepository>();

        return serviceCollection;
    }

    public static IServiceCollection RegisterServices(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IBudgetService, BudgetService>();
        serviceCollection.AddScoped<IBudgetItemService, BudgetItemService>();
        serviceCollection.AddScoped<ITagService, TagService>();
        serviceCollection.AddScoped<ITagLimitService, TagLimitService>();
        serviceCollection.AddScoped<IDateTimeService, DateTimeService>();
        serviceCollection.AddScoped<IUserService, UserService>();
        serviceCollection.AddScoped<IAuthorizationService<Budget>, BudgetAuthorizationService>();
        serviceCollection.AddScoped<IFullTextIndexService<Budget>, BudgetFullTextIndexService>();
        serviceCollection.AddScoped<IFullTextIndexService<BudgetItem>, BudgetItemFullTextIndexService>();

        return serviceCollection;
    }
}
