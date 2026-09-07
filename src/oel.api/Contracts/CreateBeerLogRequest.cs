using Oel.Api.Enums;

namespace Oel.Api.Contracts;

public sealed class CreateBeerLogRequest
{
    public double Rating { get; init; }
    public ServingFormats Format { get; init; }
    public string? Location { get; init; }
    public DateTimeOffset? DateLogged { get; init; }
    public int BeerId { get; init; }
}
