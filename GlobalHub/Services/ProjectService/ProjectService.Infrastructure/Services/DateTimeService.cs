namespace ProjectService.Infrastructure.Services;

public class DateTimeService : IDateTimeService
{
    public DateTime CurrentDate => DateTime.UtcNow;
}
