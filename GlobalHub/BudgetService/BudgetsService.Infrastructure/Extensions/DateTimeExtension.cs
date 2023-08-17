namespace BudgetsService.Infrastructure.Extensions;

public static class DateTimeExtension
{
    public static DateTime EnsureUtc(this DateTime dateTime)
    {
        return DateTime.SpecifyKind(dateTime, DateTimeKind.Utc);
    }
}
