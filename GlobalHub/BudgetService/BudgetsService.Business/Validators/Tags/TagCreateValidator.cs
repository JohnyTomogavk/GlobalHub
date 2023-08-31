namespace BudgetsService.Business.Validators.Tags;

public class TagCreateValidator : AbstractValidator<TagCreateDto>
{
    public TagCreateValidator()
    {
        RuleFor(createTagDto => createTagDto.Color).NotEmpty();
        RuleFor(createTagDto => createTagDto.Label).NotEmpty();
    }
}
