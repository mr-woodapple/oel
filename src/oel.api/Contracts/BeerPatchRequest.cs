namespace Oel.Api.Contracts;

public sealed class BeerPatchRequest
{
    public string? Name { get; init; }
    public string? Brewery { get; init; }
    public string? Style { get; init; }
    public double? Abv { get; init; }
    public int? Ibu { get; init; }
    public string? Appearance { get; init; }
    public string? TastingNotes { get; init; }
    public string? GeneralNotes { get; init; }
}
