namespace NotesService.Config;

public class NotesStoreConfig
{
    public string ConnectionString { get; set; } = null!;

    public string DatabaseName { get; set; } = null!;

    public string NotesCollectionName { get; set; } = null!;
}
