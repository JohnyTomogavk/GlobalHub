var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvFilesToConfiguration();
builder.Services.AddHttpContextAccessor();

builder.Host.UseSerilog(SerilogExtensions.LoggerConfiguration);

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(action =>
{
    action.SwaggerDoc("v1", new OpenApiInfo { Title = "Notes API", Version = "v1" });
});

builder.Services.AddScoped<INotesDbContext, NotesDbContext>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.Authority = Environment.GetEnvironmentVariable("IDENTITY_SERVICE_URL");
        options.Audience = "NotesAPI";

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
        policy.RequireClaim("scope", "GlobalHub.NotesAPI");
    })
);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment() || app.Environment.IsDockerComposeEnvironment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
