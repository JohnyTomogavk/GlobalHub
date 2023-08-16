using BudgetsService.Infrastructure.Models;
using BudgetsService.Infrastructure.Services.Interfaces;

namespace BudgetsService.Infrastructure.Services;

public class DateTimeService : IDateTimeService
{
    public DateTime CurrentDate => DateTime.UtcNow;

    public DateTimeRange GetDateTimeRangeByDate(DateTime date)
    {
        var startRangeDate = new DateTime(date.Year, date.Month, 1);
        var endRangeDate = startRangeDate.AddMonths(1).AddDays(-1);

        return new DateTimeRange(startRangeDate, endRangeDate);
    }
}
