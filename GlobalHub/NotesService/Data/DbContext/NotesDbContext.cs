namespace NotesService.Data.DbContext;

public class NotesDbContext : INotesDbContext
{
    public NotesDbContext(IOptions<NotesStoreConfig> notesStoreConfig)
    {
        var mongoClient = new MongoClient(notesStoreConfig.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(notesStoreConfig.Value.DatabaseName);
        Notes = mongoDatabase.GetCollection<Note>(notesStoreConfig.Value.NotesCollectionName);
    }

    public IMongoCollection<Note> Notes { get; }
}
