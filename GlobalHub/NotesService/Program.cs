using Common;
using Microsoft.OpenApi.Models;
using NotesService.Config;
using NotesService.Constants;
using NotesService.Data.DbContext;
using NotesService.Data.DbContext.Interfaces;
using NotesService.Data.Repositories;
using NotesService.Data.Repositories.Interfaces;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog(SerilogExtensions.LoggerConfiguration);

var notesDbConfigSection = builder.Configuration.GetSection(ConfigConstants.StorageConfigSectionName);
builder.Services.Configure<NotesStoreConfig>(notesDbConfigSection);

builder.Services.AddCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(action =>
{
    action.SwaggerDoc("v1", new OpenApiInfo { Title = "Notes API", Version = "v1" });
});

builder.Services.AddScoped<INotesDbContext, NotesDbContext>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();

var app = builder.Build();

app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
