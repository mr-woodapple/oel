using Oel.Api.Models;

namespace Oel.Api.Contracts;

public sealed record BeerResponse(
    int Id,
    string Name,
    string Brewery,
    string Style,
    double? Abv,
    int? Ibu,
    string? Appearance,
    string? TastingNotes,
    string? GeneralNotes,
    string? PhotoUrl)
{
    public static BeerResponse FromEntity(Beer beer) => new(
        beer.Id,
        beer.Name,
        beer.Brewery,
        beer.Style,
        beer.Abv,
        beer.Ibu,
        beer.Appearance,
        beer.TastingNotes,
        beer.GeneralNotes,
        beer.Photo is null ? null : $"/api/beer/{beer.Id}/photo");
}
