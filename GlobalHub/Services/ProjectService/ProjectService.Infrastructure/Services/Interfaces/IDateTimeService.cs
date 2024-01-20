namespace ProjectService.Infrastructure.Services.Interfaces;

public interface IDateTimeService
{
    /// <summary>
    /// Returns current utc datetime
    /// </summary>
    DateTime CurrentDate { get; }
}
