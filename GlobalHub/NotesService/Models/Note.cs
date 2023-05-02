namespace NotesService.Models;

// TODO: Add created by and
/// <summary>
/// Entity that represents user's note in Markdown format
/// </summary>
public class Note
{
    /// <summary>
    /// Date and time when the note was created
    /// </summary>
    public DateTime CreationDate { get; set; }

    /// <summary>
    /// Date and time when the note was created
    /// </summary>
    public DateTime UpdatedDate { get; set; }

    /// <summary>
    /// Note's title
    /// </summary>
    public string Title { get; set; }

    /// <summary>
    /// Note's content in Markdown format
    /// </summary>
    public string MarkdownContent { get; set; }
}
