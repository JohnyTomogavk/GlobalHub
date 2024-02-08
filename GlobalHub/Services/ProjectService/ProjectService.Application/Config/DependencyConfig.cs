namespace ProjectService.Application.Config;

public static class DependencyConfig
{
    public static IServiceCollection RegisterRequestHandlers(this IServiceCollection serviceCollection)
    {
        serviceCollection
            .AddScoped<
                IRequestHandler<QueryableSetRequest<ProjectDto>, IQueryable<ProjectDto>>,
                GetQueryableSetHandler<Project, ProjectDto>>();
        serviceCollection
            .AddScoped<
                IRequestHandler<QueryableSetRequest<ProjectItemDto>, IQueryable<ProjectItemDto>>,
                GetQueryableSetHandler<ProjectItem, ProjectItemDto>>();
        serviceCollection
            .AddScoped<
                IRequestHandler<QueryableSetRequest<TagDto>, IQueryable<TagDto>>,
                GetQueryableSetHandler<Tag, TagDto>>();

        return serviceCollection;
    }
}
