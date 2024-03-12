namespace NotesService.Dtos;

public record UpdateNoteContentDto
{
    public string Content { get; init; }

    public string HtmlContent { get; init; }
}
