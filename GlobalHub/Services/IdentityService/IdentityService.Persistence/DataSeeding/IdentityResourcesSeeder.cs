namespace IdentityService.Persistence.DataSeeding;

public static class IdentityResourcesSeeder
{
    public static async void ReinitializeDatabase(
        IServiceProvider serviceProvider,
        IConfiguration configuration)
    {
        using var serviceScope = serviceProvider.GetService<IServiceScopeFactory>().CreateScope();
        var configurationDbContext = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        await configurationDbContext.Database.MigrateAsync();

        var transaction = await configurationDbContext.Database.BeginTransactionAsync();

        try
        {
            await InitIdentityResources<Client>(configurationDbContext, configuration, "IdentityServer:Clients");
            await InitIdentityResources<ApiResource>(configurationDbContext, configuration,
                "IdentityServer:ApiResources");
            await InitIdentityResources<IdentityResource>(configurationDbContext, configuration,
                "IdentityServer:IdentityResources");
            await InitIdentityResources<ApiScope>(configurationDbContext, configuration, "IdentityServer:ApiScopes");

            await transaction.CommitAsync();
            Log.Information("Identity Service DB has been seeded");
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            Log.Error("Error migrating Identity Service DB: ", e.Message);
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

        await context.Set<TIdentityServerResource>()
            .AddRangeAsync(parsedResource);
        await context.SaveChangesAsync();
    }
}
