namespace NotesService.Data.DbContext;

public class NotesDbContext : INotesDbContext
{
    public NotesDbContext()
    {
        var connectionString = Environment.GetEnvironmentVariable(ConfigConstants.NoteDbConnectionStringEnvKey);
        ArgumentException.ThrowIfNullOrEmpty(connectionString);
        var mongoClient = new MongoClient(connectionString);
        var mongoDatabase = mongoClient.GetDatabase(ConfigConstants.NotesStorageDbName);
        Notes = mongoDatabase.GetCollection<Note>(ConfigConstants.NotesEntityCollectionName);
    }

    public IMongoCollection<Note> Notes { get; }
}
