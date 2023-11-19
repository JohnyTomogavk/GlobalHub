namespace NotesService.Data.Repositories.Interfaces;

public interface INotesRepository
{
    IEnumerable<Note> GetNotesMap();
    IEnumerable<Note> GetNoteList();
    Note Create(Note newNote);
    Note GetById(string id);
    void DeleteById(string id);
    Note Update(Note note);
}
