namespace BudgetsService.Business.Dto.TagLimit;

public record TagLimitsUpdateDto
{
    public IEnumerable<TagLimitDto> TagLimitDtos { get; init; }
}
