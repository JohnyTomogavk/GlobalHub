namespace NotesService.Dtos;

public record AvailableNotesDto
{
    public IEnumerable<NoteMenuItem> NoteMaps { get; init; }
}
