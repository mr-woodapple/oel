using System.ComponentModel.DataAnnotations;

namespace Oel.Api.Contracts;

public sealed class BeerLogLocationRequest : IValidatableObject
{
    public string? Name { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if ((Latitude is null) != (Longitude is null))
        {
            yield return new ValidationResult(
                "Latitude and longitude must be provided together.",
                [nameof(Latitude), nameof(Longitude)]);
            yield break;
        }

        if (Latitude is null)
        {
            yield break;
        }

        if (Latitude is double latitude && (!double.IsFinite(latitude) || latitude is < -90 or > 90))
        {
            yield return new ValidationResult(
                "Latitude must be between -90 and 90.",
                [nameof(Latitude)]);
        }

        if (Longitude is double longitude && (!double.IsFinite(longitude) || longitude is < -180 or > 180))
        {
            yield return new ValidationResult(
                "Longitude must be between -180 and 180.",
                [nameof(Longitude)]);
        }
    }
}
