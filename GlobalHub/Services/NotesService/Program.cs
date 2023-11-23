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

// TODO: Replace by authentication call on API gateway when it is implemented
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        // TODO: Extract to env variable
        options.Authority = "https://localhost:7389";
        options.TokenValidationParameters.ValidateAudience = false;
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

app.UseHttpsRedirection();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment() || app.Environment.IsEnvironment("DOCKER_COMPOSE_DEMO"))
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()
    .WithExposedHeaders("X-Correlation-id"));

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
