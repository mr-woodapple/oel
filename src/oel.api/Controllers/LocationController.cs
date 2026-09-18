using Microsoft.AspNetCore.Mvc;
using Oel.Api.Contracts;
using Oel.Api.Services;

namespace Oel.Api.Controllers;

[ApiController]
[Route("[controller]")]
public sealed class LocationController(GeoapifyService geoapify) : ControllerBase
{
    [HttpGet("nearby")]
    public async Task<IActionResult> Nearby([FromQuery] NearbyLocationsRequest request, CancellationToken cancellationToken)
    {
        if (request.Latitude is not double latitude || !double.IsFinite(latitude)
            || request.Longitude is not double longitude || !double.IsFinite(longitude))
            return BadRequest(new ProblemDetails { Title = "Valid latitude and longitude are required." });

        return await QueryAsync(() => geoapify.NearbyAsync(latitude, longitude, cancellationToken));
    }

    private async Task<IActionResult> QueryAsync<T>(Func<Task<T>> query)
    {
        Response.Headers.CacheControl = "no-store";
        try
        {
            return Ok(await query());
        }
        catch (LocationProviderException exception)
        {
            return Problem(statusCode: exception.StatusCode,
                title: "Die Ortssuche ist gerade nicht verfügbar. Koordinaten können weiterhin manuell eingegeben werden.");
        }
    }
}
