using NotesService.Config;
using NotesService.Constants;
using NotesService.Data.DbContext;
using NotesService.Data.DbContext.Interfaces;
using NotesService.Data.Repositories;
using NotesService.Data.Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);

var notesDbConfigSection = builder.Configuration.GetSection(ConfigConstants.StorageConfigSectionName);
builder.Services.Configure<NotesStoreConfig>(notesDbConfigSection);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<INotesDbContext, NotesDbContext>();
builder.Services.AddScoped<INotesRepository, NotesRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
