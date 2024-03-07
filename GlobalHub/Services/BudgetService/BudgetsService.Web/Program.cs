var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvFilesToConfiguration();
builder.Services.AddHttpContextAccessor();

builder.Host.UseSerilog(SerilogExtensions.LoggerConfiguration);

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddValidatorsFromAssemblyContaining(typeof(BudgetValidator));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(action =>
{
    action.SwaggerDoc("v1", new OpenApiInfo { Title = "Budget API", Version = "v1" });
});

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));
builder.Services.RegisterRepositories();
builder.Services.RegisterServices();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var dbConnectionString = Environment.GetEnvironmentVariable(ConfigConstants.BudgetDbConnectionStringEnvKey);
    ArgumentException.ThrowIfNullOrEmpty(dbConnectionString);
    options.UseNpgsql(dbConnectionString);
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = Environment.GetEnvironmentVariable("IDENTITY_SERVICE_URL");
        options.Audience = "BudgetsAPI";

        if (builder.Environment.IsDockerComposeEnvironment())
        {
            options.TokenValidationParameters.ValidateIssuer = false;
            options.BackchannelHttpHandler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback =
                    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };
        }
    });

builder.Services.AddAuthorization(options =>
    options.AddPolicy("ApiScope", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scope", "GlobalHub.BudgetsAPI");
    })
);

builder.Services.AddMassTransit(massTransitConfig =>
{
    massTransitConfig.UsingRabbitMq((context, cfg) =>
    {
        var eventBusConnectionString =
            Environment.GetEnvironmentVariable(CommonConstants.EVENT_BUS_CONNECTION_STRING_KEY);
        ArgumentNullException.ThrowIfNull(eventBusConnectionString);

        cfg.Host(new Uri(eventBusConnectionString));
    });
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment() || app.Environment.IsDockerComposeEnvironment())
{
    IdentityModelEventSource.ShowPII = true;
    app.UseSwagger();
    app.UseSwaggerUI();
}

await MigrateDatabase(app.Services);

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

async Task MigrateDatabase(IServiceProvider appServices)
{
    using var serviceScope = appServices.CreateScope();
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    if (dbContext.Database.GetPendingMigrations().Any())
    {
        await dbContext.Database.MigrateAsync();
        Log.Logger.Warning("Budgets database has been migrated");
    }
}
