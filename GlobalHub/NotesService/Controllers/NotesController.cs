using Microsoft.AspNetCore.Mvc;
using NotesService.Data.Repositories.Interfaces;
using NotesService.Dtos;
using NotesService.Entities;

namespace NotesService.Controllers;

/// <summary>
/// Controller that manages user's notes
/// </summary>
[ApiController]
[Route("api/v1/[controller]/[action]")]
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
    public Note GetNoteById(string id)
    {
        var note = _notesRepository.GetById(id);

        return note;
    }

    /// <summary>
    /// Creates new note
    /// </summary>
    /// <param name="createNoteDto">Dto that contains data for the new note</param>
    [HttpPost]
    public string CreateNote(CreateNoteDto createNoteDto)
    {
        // TODO: Initialize other fields when according logic will be implemented
        var newNote = new Note { CreatedDate = DateTime.Now, Title = createNoteDto.Title };
        var createdNote = _notesRepository.Create(newNote);

        return createdNote.Id;
    }

    /// <summary>
    /// Updates note's content
    /// </summary>
    /// <param name="id">Note's id</param>
    /// <param name="updateDto">Updated note's content</param>
    /// <returns>Updated note</returns>
    [HttpPut]
    public Note UpdateNoteContent(string id, [FromBody] UpdateNoteContentDto updateDto)
    {
        var note = _notesRepository.GetById(id);
        note.RichTextContent = updateDto.Content;
        note.UpdatedDate = DateTime.Now;

        return _notesRepository.Update(note);
    }

    /// <summary>
    /// Updates note's content
    /// </summary>
    /// <param name="id">Note's id</param>
    /// <param name="updateNoteTitleDto">Updated note's title</param>
    /// <returns>Updated note</returns>
    [HttpPut]
    public Note UpdateNoteTitle(string id, [FromBody] UpdateNoteTitleDto updateNoteTitleDto)
    {
        var note = _notesRepository.GetById(id);
        note.Title = updateNoteTitleDto.NewTitle;
        note.UpdatedDate = DateTime.Now;

        return _notesRepository.Update(note);
    }
}
