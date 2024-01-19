namespace ProjectService.Application.Config;

public static class DependencyConfig
{
    public static IServiceCollection RegisterServices(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped(typeof(IBaseService<>), typeof(BaseService<>));
        serviceCollection.AddScoped<IProjectService, Services.ProjectService>();

        return serviceCollection;
    }
}
