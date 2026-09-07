namespace Oel.Api.Contracts;

public sealed class CreateBeerRequest
{
    public string Name { get; init; } = string.Empty;
    public string Brewery { get; init; } = string.Empty;
    public string Style { get; init; } = string.Empty;
    public double? Abv { get; init; }
    public int? Ibu { get; init; }
    public string? Appearance { get; init; }
    public string? TastingNotes { get; init; }
    public string? GeneralNotes { get; init; }
}
