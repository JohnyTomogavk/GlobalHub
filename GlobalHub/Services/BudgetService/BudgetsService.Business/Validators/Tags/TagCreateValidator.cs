namespace BudgetsService.Business.Validators.Tags;

public class TagCreateValidator : AbstractValidator<TagCreateDto>
{
    public TagCreateValidator()
    {
        RuleFor(createTagDto => createTagDto.Color).IsInEnum();
        RuleFor(createTagDto => createTagDto.Label).NotEmpty();
    }
}
