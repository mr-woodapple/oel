using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oel.Api.Contracts;
using Oel.Api.Context;
using Oel.Api.Models;
using Oel.Api.Services;

namespace Oel.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BeerLogController(OelContext oelContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var logs = await oelContext.BeerLogs
            .AsNoTracking()
            .Select(beerLog => new
            {
                beerLog.Id,
                beerLog.Rating,
                beerLog.Format,
                beerLog.LocationName,
                beerLog.Latitude,
                beerLog.Longitude,
                beerLog.DateLogged,
                beerLog.BeerId,
                HasPhoto = beerLog.Photo != null,
            })
            .ToListAsync(cancellationToken);

        return Ok(logs.Select(beerLog => new BeerLogResponse(
            beerLog.Id,
            beerLog.Rating,
            beerLog.Format,
            beerLog.LocationName is null && beerLog.Latitude is null && beerLog.Longitude is null
                ? null
                : new BeerLogLocationResponse(
                    beerLog.LocationName,
                    beerLog.Latitude,
                    beerLog.Longitude),
            beerLog.DateLogged,
            beerLog.BeerId,
            beerLog.HasPhoto ? $"/api/beerlog/{beerLog.Id}/photo" : null)));
    }

    [HttpPost]
    public async Task<IActionResult> Post(
        [FromForm] CreateBeerLogRequest request,
        CancellationToken cancellationToken)
    {
        if (request.Rating is < 0 or > 5)
        {
            ModelState.AddModelError(nameof(request.Rating), "Rating must be between 0 and 5.");
        }

        if (!Enum.IsDefined(request.Format))
        {
            ModelState.AddModelError(nameof(request.Format), "Serving format is invalid.");
        }

        if (request.DateLogged is null)
        {
            ModelState.AddModelError(nameof(request.DateLogged), "Date logged is required.");
        }

        var beerExists = await oelContext.Beers
            .AnyAsync(beer => beer.Id == request.BeerId, cancellationToken);

        if (!beerExists)
        {
            ModelState.AddModelError(nameof(request.BeerId), "Beer does not exist.");
        }

        var (photo, photoError) = await PhotoUpload.ReadAsync(request.Photo, cancellationToken);
        if (photoError is not null)
        {
            ModelState.AddModelError(nameof(request.Photo), photoError);
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var beerLog = new BeerLog
        {
            Rating = request.Rating,
            Format = request.Format,
            LocationName = NormalizeLocationName(request.Location?.Name),
            Latitude = request.Location?.Latitude,
            Longitude = request.Location?.Longitude,
            DateLogged = request.DateLogged!.Value,
            BeerId = request.BeerId,
            Photo = photo?.Bytes,
            PhotoContentType = photo?.ContentType,
        };

        oelContext.BeerLogs.Add(beerLog);
        await oelContext.SaveChangesAsync(cancellationToken);

        return Ok(BeerLogResponse.FromEntity(beerLog));
    }

    [HttpGet("{id:int}/photo")]
    public async Task<IActionResult> GetPhoto(int id, CancellationToken cancellationToken)
    {
        var photo = await oelContext.BeerLogs
            .AsNoTracking()
            .Where(beerLog => beerLog.Id == id)
            .Select(beerLog => new { beerLog.Photo, beerLog.PhotoContentType })
            .SingleOrDefaultAsync(cancellationToken);

        if (photo?.Photo is null || photo.PhotoContentType is null)
        {
            return NotFound();
        }

        Response.Headers["X-Content-Type-Options"] = "nosniff";
        Response.Headers.CacheControl = "private, max-age=3600";
        return File(photo.Photo, photo.PhotoContentType);
    }

    [HttpPatch("{id:int}")]
    public async Task<IActionResult> Patch(
        int id,
        [FromBody] BeerLogPatchRequest request,
        CancellationToken cancellationToken)
    {
        var beerLog = await oelContext.BeerLogs
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken);

        if (beerLog is null)
        {
            return NotFound();
        }

        if (request.Rating is not null)
        {
            if (request.Rating is < 0 or > 5)
            {
                ModelState.AddModelError(nameof(request.Rating), "Rating must be between 0 and 5.");
            }
            else
            {
                beerLog.Rating = request.Rating.Value;
            }
        }

        if (request.Format is not null)
        {
            if (!Enum.IsDefined(request.Format.Value))
            {
                ModelState.AddModelError(nameof(request.Format), "Serving format is invalid.");
            }
            else
            {
                beerLog.Format = request.Format.Value;
            }
        }

        if (request.Location is not null)
        {
            beerLog.LocationName = NormalizeLocationName(request.Location.Name);
            beerLog.Latitude = request.Location.Latitude;
            beerLog.Longitude = request.Location.Longitude;
        }

        if (request.DateLogged is not null)
        {
            beerLog.DateLogged = request.DateLogged.Value;
        }

        if (request.BeerId is not null)
        {
            var beerExists = await oelContext.Beers
                .AnyAsync(beer => beer.Id == request.BeerId.Value, cancellationToken);

            if (!beerExists)
            {
                ModelState.AddModelError(nameof(request.BeerId), "Beer does not exist.");
            }
            else
            {
                beerLog.BeerId = request.BeerId.Value;
            }
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        await oelContext.SaveChangesAsync(cancellationToken);
        return Ok(BeerLogResponse.FromEntity(beerLog));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var beerLog = await oelContext.BeerLogs
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken);

        if (beerLog is null)
        {
            return NotFound();
        }

        oelContext.BeerLogs.Remove(beerLog);
        await oelContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static string? NormalizeLocationName(string? name)
    {
        var normalized = name?.Trim();
        return string.IsNullOrEmpty(normalized) ? null : normalized;
    }
}
