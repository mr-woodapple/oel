using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oel.Api.Contracts;
using Oel.Api.Context;
using Oel.Api.Models;
using Oel.Api.Services;

namespace Oel.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BeerController(OelContext oelContext) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var beers = await oelContext.Beers
            .AsNoTracking()
            .Select(beer => new
            {
                beer.Id,
                beer.Name,
                beer.Brewery,
                beer.Style,
                beer.Abv,
                beer.Ibu,
                beer.Appearance,
                beer.TastingNotes,
                beer.GeneralNotes,
                HasPhoto = beer.Photo != null,
            })
            .ToListAsync(cancellationToken);

        return Ok(beers.Select(beer => new BeerResponse(
            beer.Id,
            beer.Name,
            beer.Brewery,
            beer.Style,
            beer.Abv,
            beer.Ibu,
            beer.Appearance,
            beer.TastingNotes,
            beer.GeneralNotes,
            beer.HasPhoto ? $"/api/beer/{beer.Id}/photo" : null)));
    }

    [HttpPost]
    public async Task<IActionResult> Post(
        [FromForm] CreateBeerRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            ModelState.AddModelError(nameof(request.Name), "Name is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Brewery))
        {
            ModelState.AddModelError(nameof(request.Brewery), "Brewery is required.");
        }

        if (string.IsNullOrWhiteSpace(request.Style))
        {
            ModelState.AddModelError(nameof(request.Style), "Style is required.");
        }

        if (request.Abv is < 0 or > 100)
        {
            ModelState.AddModelError(nameof(request.Abv), "ABV must be between 0 and 100.");
        }

        if (request.Ibu < 0)
        {
            ModelState.AddModelError(nameof(request.Ibu), "IBU cannot be negative.");
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

        var beer = new Beer
        {
            Name = request.Name.Trim(),
            Brewery = request.Brewery.Trim(),
            Style = request.Style.Trim(),
            Abv = request.Abv,
            Ibu = request.Ibu,
            Appearance = request.Appearance?.Trim(),
            TastingNotes = request.TastingNotes?.Trim(),
            GeneralNotes = request.GeneralNotes?.Trim(),
            Photo = photo?.Bytes,
            PhotoContentType = photo?.ContentType,
        };

        oelContext.Beers.Add(beer);
        await oelContext.SaveChangesAsync(cancellationToken);

        return Ok(BeerResponse.FromEntity(beer));
    }

    [HttpGet("{id:int}/photo")]
    public async Task<IActionResult> GetPhoto(int id, CancellationToken cancellationToken)
    {
        var photo = await oelContext.Beers
            .AsNoTracking()
            .Where(beer => beer.Id == id)
            .Select(beer => new { beer.Photo, beer.PhotoContentType })
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
        [FromBody] BeerPatchRequest request,
        CancellationToken cancellationToken)
    {
        var beer = await oelContext.Beers
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken);

        if (beer is null)
        {
            return NotFound();
        }

        if (request.Name is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
            {
                ModelState.AddModelError(nameof(request.Name), "Name cannot be empty.");
            }
            else
            {
                beer.Name = request.Name.Trim();
            }
        }

        if (request.Brewery is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Brewery))
            {
                ModelState.AddModelError(nameof(request.Brewery), "Brewery cannot be empty.");
            }
            else
            {
                beer.Brewery = request.Brewery.Trim();
            }
        }

        if (request.Style is not null)
        {
            if (string.IsNullOrWhiteSpace(request.Style))
            {
                ModelState.AddModelError(nameof(request.Style), "Style cannot be empty.");
            }
            else
            {
                beer.Style = request.Style.Trim();
            }
        }

        if (request.Abv is not null)
        {
            if (request.Abv is < 0 or > 100)
            {
                ModelState.AddModelError(nameof(request.Abv), "ABV must be between 0 and 100.");
            }
            else
            {
                beer.Abv = request.Abv;
            }
        }

        if (request.Ibu is not null)
        {
            if (request.Ibu < 0)
            {
                ModelState.AddModelError(nameof(request.Ibu), "IBU cannot be negative.");
            }
            else
            {
                beer.Ibu = request.Ibu;
            }
        }

        if (request.Appearance is not null)
        {
            beer.Appearance = request.Appearance.Trim();
        }

        if (request.TastingNotes is not null)
        {
            beer.TastingNotes = request.TastingNotes.Trim();
        }

        if (request.GeneralNotes is not null)
        {
            beer.GeneralNotes = request.GeneralNotes.Trim();
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        await oelContext.SaveChangesAsync(cancellationToken);
        return Ok(BeerResponse.FromEntity(beer));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var beer = await oelContext.Beers
            .SingleOrDefaultAsync(candidate => candidate.Id == id, cancellationToken);

        if (beer is null)
        {
            return NotFound();
        }

        oelContext.Beers.Remove(beer);
        await oelContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
