using Oel.Api.Models;

namespace Oel.Api.Contracts;

public sealed record BeerLogResponse(
    int Id,
    double Rating,
    Enums.ServingFormats Format,
    string? Location,
    DateTimeOffset DateLogged,
    int BeerId,
    string? PhotoUrl)
{
    public static BeerLogResponse FromEntity(BeerLog beerLog) => new(
        beerLog.Id,
        beerLog.Rating,
        beerLog.Format,
        beerLog.Location,
        beerLog.DateLogged,
        beerLog.BeerId,
        beerLog.Photo is null ? null : $"/api/beerlog/{beerLog.Id}/photo");
}
