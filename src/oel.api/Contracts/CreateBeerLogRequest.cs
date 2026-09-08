using Oel.Api.Enums;

namespace Oel.Api.Contracts;

public sealed class CreateBeerLogRequest
{
    public double Rating { get; init; }
    public ServingFormats Format { get; init; }
    public BeerLogLocationRequest? Location { get; init; }
    public DateTimeOffset? DateLogged { get; init; }
    public int BeerId { get; init; }
    public IFormFile? Photo { get; init; }
}
