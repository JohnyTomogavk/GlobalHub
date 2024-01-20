using Common.Services;
using Common.Services.Abstract;
using Microsoft.Extensions.DependencyInjection;
using ProjectService.Infrastructure.Services;

namespace ProjectService.Infrastructure.Config;

public static class DependencyConfig
{
    public static IServiceCollection RegisterInfrastructureServices(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IDateTimeService, DateTimeService>();
        serviceCollection.AddScoped<IUserService, UserService>();

        return serviceCollection;
    }
}
