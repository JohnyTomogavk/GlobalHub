namespace BudgetsService.Infrastructure.Services.Interfaces;

public interface IDateTimeService
{
    /// <summary>
    /// Returns current utc datetime
    /// </summary>
    DateTime CurrentDate { get; }

    /// <summary>
    /// Returns datetime range that starts at the start of the specified month and ends at the end of the month
    /// </summary>
    /// <param name="date">Datetime to build the dates range</param>
    /// <returns>Range of dates</returns>
    DateTimeRange GetDateTimeRangeByDate(DateTime date);
}
