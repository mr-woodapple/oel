namespace Oel.Api.Contracts;

public sealed class UpdateBeerRequest
{
    public string Name { get; init; } = string.Empty;
    public string Brewery { get; init; } = string.Empty;
    public string Style { get; init; } = string.Empty;
    public double? Abv { get; init; }
    public int? Ibu { get; init; }
    public string? Appearance { get; init; }
    public string? TastingNotes { get; init; }
    public string? GeneralNotes { get; init; }
    public IFormFile? Photo { get; init; }
    public bool RemovePhoto { get; init; }
}
