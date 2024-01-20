namespace ProjectService.Application.Config;

public static class DependencyConfig
{
    public static IServiceCollection RegisterRequestHandlers(this IServiceCollection serviceCollection)
    {
        serviceCollection
            .AddScoped<
                IRequestHandler<QueryableSetRequest<ProjectDto>, IQueryable<ProjectDto>>,
                GetQueryableSetHandler<Project, ProjectDto>>();

        return serviceCollection;
    }
}
