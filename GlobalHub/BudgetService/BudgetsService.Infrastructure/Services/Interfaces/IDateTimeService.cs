using BudgetsService.Infrastructure.Models;

namespace BudgetsService.Infrastructure.Services.Interfaces;

public interface IDateTimeService
{
    public DateTime CurrentDate { get; }

    DateTimeRange GetDateTimeRangeByDate(DateTime date);
}
