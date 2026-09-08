using System.ComponentModel.DataAnnotations;

namespace Oel.Api.Contracts;

public sealed class BeerLogLocationRequest : IValidatableObject
{
    public string? Name { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Latitude is null || Longitude is null)
        {
            yield return new ValidationResult(
                "Latitude and longitude are both required for a location.",
                [nameof(Latitude), nameof(Longitude)]);
            yield break;
        }

        if (!double.IsFinite(Latitude.Value) || Latitude is < -90 or > 90)
        {
            yield return new ValidationResult(
                "Latitude must be between -90 and 90.",
                [nameof(Latitude)]);
        }

        if (!double.IsFinite(Longitude.Value) || Longitude is < -180 or > 180)
        {
            yield return new ValidationResult(
                "Longitude must be between -180 and 180.",
                [nameof(Longitude)]);
        }
    }
}
