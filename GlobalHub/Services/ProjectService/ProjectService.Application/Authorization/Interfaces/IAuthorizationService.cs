namespace ProjectService.Application.Authorization.Interfaces;

/// <summary>
/// Service that authorizes operations on entities
/// </summary>
public interface IAuthorizationService<T>
    where T : BaseEntity
{
    Expression<Func<T, bool>> GetSearchFilterExpressions(string userId);

    /// <summary>
    /// Checks if user is able to read entity
    /// </summary>
    /// <param name="userId">User Id.</param>
    /// <param name="entityId">Entity's id to authorize user's operation on.</param>
    /// <returns>True - if user is authenticated to perform operation, otherwise false.</returns>
    Task<bool> AuthorizeRead(string userId, long entityId);

    /// <summary>
    /// Checks if user is able to update the provided entity
    /// </summary>
    /// <param name="userId">User Id.</param>
    /// <param name="entityId">Entity's id to authorize user's operation on.</param>
    /// <returns>True - if user is authenticated to perform operation, otherwise false.</returns>
    Task<bool> AuthorizeUpdate(string userId, long entityId);

    /// <summary>
    /// Checks if user is able to delete the provided entity
    /// </summary>
    /// <param name="userId">User Id.</param>
    /// <param name="entityId">Entity's id to authorize user's operation on.</param>
    /// <returns>True - if user is authenticated to perform operation, otherwise false.</returns>
    Task<bool> AuthorizeDelete(string userId, long entityId);
}
