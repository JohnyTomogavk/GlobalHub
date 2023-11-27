namespace IdentityService.Presentation;

internal static class HostingExtensions
{
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
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
            Environment.GetEnvironmentVariable(EnvVariablesConfig.IdentityDbConnectionStringKey) ??
            throw new ArgumentNullException(EnvVariablesConfig.IdentityDbConnectionStringKey);

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(identityDbConnectionString));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
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
                    Environment.GetEnvironmentVariable(EnvVariablesConfig.ConfigurationDbConnectionStringKey) ??
                    throw new ArgumentNullException(EnvVariablesConfig.ConfigurationDbConnectionStringKey);

                options.ConfigureDbContext = b =>
                    b.UseSqlServer(configurationDbConnectionString,
                        dbOpts => dbOpts.MigrationsAssembly(migrationAssemblyName));
            })
            .AddOperationalStore(options =>
            {
                var operationalDbConnectionString =
                    Environment.GetEnvironmentVariable(EnvVariablesConfig.OperationalDbConnectionStringKey) ??
                    throw new ArgumentNullException(EnvVariablesConfig.OperationalDbConnectionStringKey);

                options.ConfigureDbContext = b =>
                    b.UseSqlServer(operationalDbConnectionString,
                        dbOpts => dbOpts.MigrationsAssembly(migrationAssemblyName));
            })
            .AddAspNetIdentity<ApplicationUser>();

        builder.Services.AddScoped<IProfileService, AppProfileService>();

        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();

        var shouldReinitializeDatabaseEnv =
            Environment.GetEnvironmentVariable(EnvVariablesConfig.ReinitializeIdentityResources);
        var parsed = bool.TryParse(shouldReinitializeDatabaseEnv, out var shouldReinitialize);

        if (parsed && shouldReinitialize)
        {
            IdentityResourcesSeeder.ReinitializeDatabase(app.Services, app.Configuration);
        }

        app.UseHttpsRedirection();
        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("DOCKER_COMPOSE_DEMO"))
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseDeveloperExceptionPage();
        }
        else
        {
            app.UseHsts();
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
}
