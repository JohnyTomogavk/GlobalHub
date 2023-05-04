﻿using MongoDB.Driver;
using NotesService.Data.DbContext.Interfaces;
using NotesService.Data.Repositories.Interfaces;
using NotesService.Entities;

namespace NotesService.Data.Repositories;

public class NotesRepository : INotesRepository
{
    private readonly INotesDbContext _notesDbContext;

    public NotesRepository(INotesDbContext notesDbContext)
    {
        _notesDbContext = notesDbContext;
    }

    public IEnumerable<Note> GetAll()
    {
        return _notesDbContext.Notes.FindSync(note => note != null).ToList();
    }

    public Note Create(Note newNote)
    {
        _notesDbContext.Notes.InsertOne(newNote);
        return newNote;
    }

    public Note GetById(string id)
    {
        return _notesDbContext.Notes.FindSync(note => note.Id == id).First();
    }

    public void DeleteById(string id)
    {
        _notesDbContext.Notes.DeleteOne(note => note.Id == id);
    }

    public Note Update(Note note)
    {
        _notesDbContext.Notes.ReplaceOne(item => item.Id == note.Id, note);
        return note;
    }
}