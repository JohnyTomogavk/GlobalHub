namespace NotesService.Data.DbContext.Interfaces;

public interface INotesDbContext
{
    public IMongoCollection<Note> Notes { get; }
}
