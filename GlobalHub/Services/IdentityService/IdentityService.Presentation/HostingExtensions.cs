namespace IdentityService.Presentation;

internal static class HostingExtensions
{
    public static async Task<WebApplication> ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Configuration.AddEnvFilesToConfiguration();
        builder.Host.UseSerilog(SerilogExtensions.LoggerConfiguration);
        builder.Services.AddHttpContextAccessor();

        builder.Services.AddCors();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddControllers();

        builder.Services.AddSwaggerGen(action =>
        {
            action.SwaggerDoc("v1", new OpenApiInfo { Title = "Identity API", Version = "v1" });
        });

        builder.Services.AddRazorPages();

        var identityDbConnectionString =
            Environment.GetEnvironmentVariable(EnvVariablesConfig.IdentityDbConnectionStringKey);
        ArgumentException.ThrowIfNullOrEmpty(identityDbConnectionString);

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(identityDbConnectionString));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
            {
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var migrationAssemblyName = typeof(ApplicationDbContext).Assembly.GetName().Name;

        builder.Services
            .AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

                options.EmitStaticAudienceClaim = true;
            })
            .AddConfigurationStore(options =>
            {
                var configurationDbConnectionString =
                    Environment.GetEnvironmentVariable(EnvVariablesConfig.ConfigurationDbConnectionStringKey);
                ArgumentException.ThrowIfNullOrEmpty(configurationDbConnectionString);

                options.ConfigureDbContext = b =>
                    b.UseSqlServer(configurationDbConnectionString,
                        dbOpts => dbOpts.MigrationsAssembly(migrationAssemblyName));
            })
            .AddOperationalStore(options =>
            {
                var operationalDbConnectionString =
                    Environment.GetEnvironmentVariable(EnvVariablesConfig.OperationalDbConnectionStringKey);
                ArgumentException.ThrowIfNullOrEmpty(operationalDbConnectionString);

                options.ConfigureDbContext = b =>
                    b.UseSqlServer(operationalDbConnectionString,
                        dbOpts => dbOpts.MigrationsAssembly(migrationAssemblyName));
            })
            .AddAspNetIdentity<ApplicationUser>();

        builder.Services.AddAuthentication()
            .AddGoogle(GoogleDefaults.AuthenticationScheme, options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

                options.ClientId = "<insert here>";
                options.ClientSecret = "<insert here>";
            })
            .AddGitHub(GitHubAuthenticationDefaults.AuthenticationScheme, options =>
            {
                options.SignInScheme = IdentityServerConstants.ExternalCookieAuthenticationScheme;

                options.ClientId = "<insert here>";
                options.ClientSecret = "<insert here>";
            });

        builder.Services.AddScoped<IProfileService, AppProfileService>();

        var app = builder.Build();

        var shouldReinitializeDatabaseEnv =
            Environment.GetEnvironmentVariable(EnvVariablesConfig.ReinitializeIdentityResources);
        var parsed = bool.TryParse(shouldReinitializeDatabaseEnv, out var shouldReinitialize);

        if (parsed && shouldReinitialize)
        {
            await MigrateDatabases(app.Services);
            await IdentityResourcesSeeder.ReinitializeDatabase(app.Services, builder.Configuration);
        }

        return app;
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseDeveloperExceptionPage();
        }

        app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
            .WithExposedHeaders("X-Correlation-id"));

        app.UseStaticFiles();
        app.UseRouting();
        app.UseIdentityServer();
        app.UseAuthorization();

        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }

    private static async Task MigrateDatabases(IServiceProvider serviceProvider)
    {
        using var serviceScope = serviceProvider.GetService<IServiceScopeFactory>().CreateScope();
        var appIdentityDbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var configDbContext = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        var operationalDbContext = serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>();
        var databases = new[]
        {
            appIdentityDbContext.Database, configDbContext.Database, operationalDbContext.Database
        };

        try
        {
            foreach (var db in databases)
            {
                await db.MigrateAsync();
            }

            Log.Information("Identity Service's DBs have been migrated");
        }
        catch (Exception e)
        {
            Log.Fatal("Error migrating DBs {E}", e);
            throw;
        }
    }
}
