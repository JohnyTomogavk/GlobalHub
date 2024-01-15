var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvFilesToConfiguration();
builder.Services.AddHttpContextAccessor();

builder.Host.UseSerilog(SerilogExtensions.LoggerConfiguration);

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(action =>
{
    action.SwaggerDoc("v1", new OpenApiInfo { Title = "Projects API", Version = "v1" });
});

builder.Services.AddScoped<IDateTimeService, DateTimeService>();
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddDbContext<ApplicationDbContext>(optionsBuilder =>
{
    var connectionString = Environment.GetEnvironmentVariable(ConfigConstants.ProjectsDbConnectionStringEnvKey);

    optionsBuilder.UseSqlServer(connectionString);
});

// TODO: Add JWT Bearer authentication after API tested

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment() || app.Environment.IsDockerComposeEnvironment())
{
    IdentityModelEventSource.ShowPII = true;
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
