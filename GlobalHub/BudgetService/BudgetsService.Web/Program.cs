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

var app = builder.Build();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));
app.UseAuthorization();
app.MapControllers();

app.Run();
