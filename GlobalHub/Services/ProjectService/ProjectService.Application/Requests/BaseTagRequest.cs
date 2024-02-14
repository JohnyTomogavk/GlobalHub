namespace ProjectService.Application.Requests;

public abstract record BaseTagRequest
{
    public long ProjectId { get; init; }
    public string Label { get; init; }
    public ETagColor Color { get; init; }
}
