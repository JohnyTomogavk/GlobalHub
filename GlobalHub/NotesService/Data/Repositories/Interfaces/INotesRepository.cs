using NotesService.Entities;

namespace NotesService.Data.Repositories.Interfaces;

public interface INotesRepository
{
    IEnumerable<Note> GetAll();
    Note Create(Note newNote);
    Note GetById(string id);
    void DeleteById(string id);
    Note Update(Note note);
}
