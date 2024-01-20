namespace ProjectService.Application.Config;

public static class DependencyConfig
{
    public static IServiceCollection RegisterRequestHandlers(this IServiceCollection serviceCollection)
    {
        serviceCollection
            .AddScoped<IRequestHandler<QueryableSetRequest<Project>, IQueryable<Project>>,
                GetQueryableSetHandler<Project>>();

        return serviceCollection;
    }
}
