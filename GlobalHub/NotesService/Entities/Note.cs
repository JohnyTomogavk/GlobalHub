using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NotesService.Entities;

// TODO: Add createdBy and updatedBy fields
/// <summary>
/// Entity that represents user's note in Markdown format
/// </summary>
public class Note
{
    /// <summary>
    /// Entity Id
    /// </summary>
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    /// <summary>
    /// Date and time when the note was created
    /// </summary>
    public DateTime CreationDate { get; set; }

    /// <summary>
    /// Date and time when the note was created
    /// </summary>
    public DateTime? UpdatedDate { get; set; } = null;

    /// <summary>
    /// Note's title
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Note's content in Markdown format
    /// </summary>
    public string MarkdownContent { get; set; } = string.Empty;
}
