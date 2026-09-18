using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.WebUtilities;
using Oel.Api.Contracts;

namespace Oel.Api.Services;

public sealed class GeoapifyService(HttpClient httpClient, IConfiguration configuration)
{
    private const string Categories = "catering,entertainment,leisure,tourism,accommodation,activity,commercial";

    public async Task<IReadOnlyList<LocationSuggestionResponse>> NearbyAsync(
        double latitude, double longitude, CancellationToken cancellationToken)
    {
        var point = $"{longitude.ToString(CultureInfo.InvariantCulture)},{latitude.ToString(CultureInfo.InvariantCulture)}";
        var result = await GetAsync("v2/places", new()
        {
            ["categories"] = Categories,
            ["filter"] = $"circle:{point},1000",
            ["bias"] = $"proximity:{point}",
            ["limit"] = "20",
        }, cancellationToken);
        return Suggestions(result);
    }

    private async Task<FeatureCollection> GetAsync(
        string path, Dictionary<string, string?> parameters, CancellationToken cancellationToken)
    {
        var apiKey = configuration["Geoapify:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new LocationProviderException(StatusCodes.Status503ServiceUnavailable);

        parameters["apiKey"] = apiKey;
        parameters["lang"] = "de";
        try
        {
            using var response = await httpClient.GetAsync(QueryHelpers.AddQueryString(path, parameters), cancellationToken);
            if (!response.IsSuccessStatusCode)
                throw new LocationProviderException(StatusCodes.Status502BadGateway);

            var result = await response.Content.ReadFromJsonAsync<FeatureCollection>(cancellationToken);
            return result is { Features: not null }
                ? result
                : throw new LocationProviderException(StatusCodes.Status502BadGateway);
        }
        catch (HttpRequestException)
        {
            throw new LocationProviderException(StatusCodes.Status502BadGateway);
        }
        catch (JsonException)
        {
            throw new LocationProviderException(StatusCodes.Status502BadGateway);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            throw new LocationProviderException(StatusCodes.Status504GatewayTimeout);
        }
    }

    private static IReadOnlyList<LocationSuggestionResponse> Suggestions(FeatureCollection collection) =>
        collection.Features.Select(feature => feature.Properties)
            .OfType<PlaceProperties>()
            .Where(place => !string.IsNullOrWhiteSpace(place.Name) && !string.IsNullOrWhiteSpace(place.PlaceId)
                && place.Lat is double latitude && double.IsFinite(latitude) && latitude is >= -90 and <= 90
                && place.Lon is double longitude && double.IsFinite(longitude) && longitude is >= -180 and <= 180)
            .DistinctBy(place => place.PlaceId)
            .Select(place => new LocationSuggestionResponse(
                place.PlaceId!, place.Name!, place.Formatted ?? "", place.Lat!.Value, place.Lon!.Value,
                place.Distance is double distance && double.IsFinite(distance) && distance >= 0 ? distance : null))
            .ToList();

    private sealed record FeatureCollection(List<Feature> Features);
    private sealed record Feature(PlaceProperties? Properties);
    private sealed record PlaceProperties(
        [property: JsonPropertyName("place_id")] string? PlaceId,
        string? Name, string? Formatted, double? Lat, double? Lon, double? Distance);
}

public sealed class LocationProviderException(int statusCode) : Exception("Location search is unavailable.")
{
    public int StatusCode { get; } = statusCode;
}
