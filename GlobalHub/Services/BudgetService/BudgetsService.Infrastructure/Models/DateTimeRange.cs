namespace BudgetsService.Infrastructure.Models;

public class DateTimeRange
{
    public DateTimeRange(DateTime startRangeDate, DateTime endRangeDate)
    {
        StartRangeDate = startRangeDate;
        EndRangeDate = endRangeDate;
    }

    public DateTime StartRangeDate { get; set; }

    public DateTime EndRangeDate { get; set; }
}
