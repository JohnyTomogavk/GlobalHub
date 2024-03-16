namespace NotesService.Dtos;

public record UpdateNoteContentDto
{
    public string Content { get; init; }

    public string PlainTextContent { get; init; }
}
