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
    var dbConnectionString = Environment.GetEnvironmentVariable(ConfigConstants.BudgetDbConnectionStringEnvKey) ??
                             throw new ArgumentNullException(nameof(ConfigConstants.BudgetDbConnectionStringEnvKey));
    options.UseNpgsql(dbConnectionString);
});

// TODO: Replace by authentication call on API gateway when it is implemented
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = Environment.GetEnvironmentVariable("IDENTITY_SERVICE_URL");
        options.TokenValidationParameters.ValidateAudience = false;
    });

builder.Services.AddAuthorization(options =>
    options.AddPolicy("ApiScope", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("scope", "GlobalHub.BudgetsAPI");
    })
);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

using var serviceScope = app.Services.CreateScope();
var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

if (dbContext.Database.GetPendingMigrations().Any())
{
    await dbContext.Database.MigrateAsync();
    Log.Logger.Warning("Budgets database has been migrated");
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
