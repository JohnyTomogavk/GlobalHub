namespace NotesService.Data.Repositories.Interfaces;

public interface INotesRepository
{
    IEnumerable<Note> GetNotesMap(string userId);
    IEnumerable<Note> GetNoteList(string userId);
    Note Create(Note newNote);
    Note GetById(string id);
    void DeleteById(string id);
    Note Update(Note note);
}
