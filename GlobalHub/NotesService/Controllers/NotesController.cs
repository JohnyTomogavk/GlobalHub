using Microsoft.AspNetCore.Mvc;
using NotesService.Data.Repositories.Interfaces;
using NotesService.Entities;

namespace NotesService.Controllers;

/// <summary>
/// Controller that manages user's notes
/// </summary>
[ApiController]
[Route("[controller]/[action]")]
public class NotesController : ControllerBase
{
    private readonly INotesRepository _notesRepository;

    public NotesController(INotesRepository notesRepository)
    {
        _notesRepository = notesRepository;
    }

    /// <summary>
    /// Gets all notes
    /// </summary>
    /// <returns>Set that contains all notes from database</returns>
    [HttpGet]
    public IEnumerable<Note> GetAllNotes()
    {
        var notes = _notesRepository.GetAll();
        return notes;
    }

    /// <summary>
    /// Creates new note
    /// </summary>
    /// <param name="note">New note that contains user's data</param>
    [HttpPost]
    public Note CreateNote(Note note)
    {
        return _notesRepository.Create(note);
    }
}
