using Oel.Api.Models;

namespace Oel.Api.Contracts;

public sealed record BeerLogResponse(
    int Id,
    double Rating,
    Enums.ServingFormats Format,
    BeerLogLocationResponse? Location,
    DateTimeOffset DateLogged,
    int BeerId,
    string? PhotoUrl)
{
    public static BeerLogResponse FromEntity(BeerLog beerLog) => new(
        beerLog.Id,
        beerLog.Rating,
        beerLog.Format,
        BeerLogLocationResponse.FromEntity(beerLog),
        beerLog.DateLogged,
        beerLog.BeerId,
        beerLog.Photo is null ? null : $"/api/beerlog/{beerLog.Id}/photo");
}

public sealed record BeerLogLocationResponse(
    string? Name,
    double? Latitude,
    double? Longitude)
{
    public static BeerLogLocationResponse? FromEntity(BeerLog beerLog) =>
        beerLog.LocationName is null && beerLog.Latitude is null && beerLog.Longitude is null
            ? null
            : new BeerLogLocationResponse(
                beerLog.LocationName,
                beerLog.Latitude,
                beerLog.Longitude);
}
