namespace NotesService.Entities.Services.Interfaces;

/// <summary>
/// Service for retrieving information from user's identity
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Returns User Id
    /// </summary>
    string UserId { get; }
}
