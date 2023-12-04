namespace IdentityService.Persistence.DataSeeding;

public static class IdentityResourcesSeeder
{
    public static async Task ReinitializeDatabase(
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        using var serviceScope = serviceProvider.GetService<IServiceScopeFactory>().CreateScope();
        var configurationDbContext = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();

        try
        {
            await InitIdentityResources<Client>(configurationDbContext, configuration, "IdentityServer:Clients");
            await InitIdentityResources<ApiResource>(configurationDbContext, configuration,
                "IdentityServer:ApiResources");
            await InitIdentityResources<IdentityResource>(configurationDbContext, configuration,
                "IdentityServer:IdentityResources");
            await InitIdentityResources<ApiScope>(configurationDbContext, configuration, "IdentityServer:ApiScopes");

            await configurationDbContext.SaveChangesAsync();
            Log.Information("Identity Service DB has been seeded");
        }
        catch (Exception e)
        {
            Log.Error("Error seeding Identity Service DB: {E}", e);
            throw;
        }
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

        var dbSet = context.Set<TIdentityServerResource>();
        var entities = dbSet.AsQueryable();
        dbSet.RemoveRange(entities);
        await dbSet.AddRangeAsync(parsedResource);
    }
}
