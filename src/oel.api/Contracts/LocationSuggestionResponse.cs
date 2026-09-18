namespace Oel.Api.Contracts;

public sealed record LocationSuggestionResponse(
    string Id, string Name, string Address, double Latitude, double Longitude, double? Distance);
