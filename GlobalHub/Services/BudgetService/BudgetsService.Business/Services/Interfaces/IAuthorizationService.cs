using BudgetsService.DataAccess.Entities.Base;

namespace BudgetsService.Business.Services.Interfaces;

/// <summary>
/// Service that authorizes operations on budgets
/// </summary>
public interface IAuthorizationService<T>
    where T : BaseEntity
{
    /// <summary>
    /// Checks if user is able to read entity
    /// </summary>
    /// <param name="userId">User Id</param>
    /// <param name="entityIds">Entity Ids to authorize user's operation on</param>
    /// <returns>True - if user is authenticated to perform operation, otherwise false</returns>
    Task<bool> AuthorizeRead(string userId, IEnumerable<long> entityIds);

    /// <summary>
    /// Checks if user is able to read entity
    /// </summary>
    /// <param name="userId">User Id</param>
    /// <param name="entityId">Entity to authorize user's operation on</param>
    /// <returns>True - if user is authenticated to perform operation, otherwise false</returns>
    Task<bool> AuthorizeRead(string userId, long entityId);

    /// <summary>
    /// Checks if user is able to update the provided entity
    /// </summary>
    /// <param name="userId">User Id</param>
    /// <param name="entityId">Entity to authorize user's operation on</param>
    /// <returns>True - if user is authenticated to perform operation, otherwise false</returns>
    Task<bool> AuthorizeUpdate(string userId, long entityId);

    /// <summary>
    /// Checks if user is able to delete the provided entity
    /// </summary>
    /// <param name="userId">User Id</param>
    /// <param name="entityId">Entity to authorize user's operation on</param>
    /// <returns>True - if user is authenticated to perform operation, otherwise false</returns>
    Task<bool> AuthorizeDelete(string userId, long entityId);
}
