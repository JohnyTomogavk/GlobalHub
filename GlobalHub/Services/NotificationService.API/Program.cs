var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvFilesToConfiguration();
builder.Services.AddHttpContextAccessor();
builder.Host.UseSerilog(SerilogExtensions.LoggerConfiguration);
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(action =>
{
    action.SwaggerDoc("v1", new OpenApiInfo { Title = "Notifications API", Version = "v1" });
    action.AddSecurityDefinition(
        "bearerAuth",
        new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "JWT Authorization header using the Bearer scheme.",
        });
    action.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearerAuth" },
            },
            Array.Empty<string>()
        },
    });
});

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = Environment.GetEnvironmentVariable("IDENTITY_SERVICE_URL");
        options.Audience = "NotificationsAPI";

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
        policy.RequireClaim("scope", "GlobalHub.NotificationsAPI");
    }));

builder.Services.AddMassTransit(configurator =>
{
    configurator.AddConsumer<OnEventStartedConsumer>();
    configurator.AddConsumer<BeforeEventStartedConsumer>();
    configurator.AddConsumer<BeforeTaskDueDateConsumer>();

    configurator.UsingRabbitMq((context, cfg) =>
    {
        var eventBusConnectionString =
            Environment.GetEnvironmentVariable(CommonConstants.EVENT_BUS_CONNECTION_STRING_KEY);
        ArgumentNullException.ThrowIfNull(eventBusConnectionString);

        cfg.Host(new Uri(eventBusConnectionString));
        cfg.ConfigureEndpoints(context);
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

app.UseCors(corsPolicyBuilder => corsPolicyBuilder
    .AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
