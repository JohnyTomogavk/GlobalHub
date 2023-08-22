namespace BudgetsService.Infrastructure.Extensions;

public static class DecimalExtension
{
    public static decimal GetMedianValue(this decimal[] values)
    {
        if (!values.Any())
            return default;

        Array.Sort(values);
        return values[(values.Length / 2)];
    }
}
