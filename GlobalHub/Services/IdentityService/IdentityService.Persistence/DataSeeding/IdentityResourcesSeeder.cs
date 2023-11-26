namespace IdentityService.Persistence.DataSeeding;

public static class IdentityResourcesSeeder
{
    public static async void ReinitializeDatabase(
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        using var serviceScope = serviceProvider.GetService<IServiceScopeFactory>().CreateScope();

        var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        await context.Database.EnsureDeletedAsync();

        await serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.MigrateAsync();
        await context.Database.MigrateAsync();

        await InitIdentityResources<Client>(context, configuration, "IdentityServer:Clients");
        await InitIdentityResources<ApiResource>(context, configuration, "IdentityServer:ApiResources");
        await InitIdentityResources<IdentityResource>(context, configuration, "IdentityServer:IdentityResources");
        await InitIdentityResources<ApiScope>(context, configuration, "IdentityServer:ApiScopes");

        await context.SaveChangesAsync();
    }

    private static async Task InitIdentityResources<TIdentityServerResource>(
        ConfigurationDbContext context,
        IConfiguration configuration,
        string configSectionKey)
        where TIdentityServerResource : class
    {
        var configurationSection = configuration.GetSection(configSectionKey);
        var parsedResource = new List<TIdentityServerResource>();
        configurationSection.Bind(parsedResource);

        if (!parsedResource.Any())
        {
            throw new IdentityConfigNotFoundException(nameof(TIdentityServerResource));
        }

        await context.Set<TIdentityServerResource>()
            .AddRangeAsync(parsedResource);
    }
}
