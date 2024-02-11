var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvFilesToConfiguration();
builder.Services.AddHttpContextAccessor();

builder.Host.UseSerilog(SerilogExtensions.LoggerConfiguration);

builder.Services.AddCors();
builder.Services.AddControllers().RegisterOData();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(action =>
{
    action.SwaggerDoc("v1", new OpenApiInfo { Title = "Projects API", Version = "v1" });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = Environment.GetEnvironmentVariable("IDENTITY_SERVICE_URL");
        options.Audience = "ProjectsAPI";

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
        policy.RequireClaim("scope", "GlobalHub.ProjectsAPI");
    })
);

builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining(typeof(CreateProjectRequest));
});

builder.Services.AddValidatorsFromAssemblyContaining(typeof(BaseTagValidator<>));

builder.Services.AddAutoMapper(config =>
{
    config.AddProfile<MappingProfile>();
});

builder.Services.RegisterInfrastructureServices();
builder.Services.RegisterRequestHandlers();

builder.Services.AddDbContext<ApplicationDbContext>(optionsBuilder =>
{
    var connectionString = Environment.GetEnvironmentVariable(ConfigConstants.ProjectsDbConnectionStringEnvKey);
    optionsBuilder.UseSqlServer(connectionString);
});

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment() || app.Environment.IsDockerComposeEnvironment())
{
    IdentityModelEventSource.ShowPII = true;
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseODataRouteDebug();
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
