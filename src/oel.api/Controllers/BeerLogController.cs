using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Oel.Api.Contracts;
using Oel.Api.Context;
using Oel.Api.Models;

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
            .ToListAsync(cancellationToken);

        return Ok(logs);
    }

    [HttpPost]
    public async Task<IActionResult> Post(
        [FromBody] CreateBeerLogRequest request,
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

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        var beerLog = new BeerLog
        {
            Rating = request.Rating,
            Format = request.Format,
            Location = request.Location?.Trim(),
            DateLogged = request.DateLogged!.Value,
            BeerId = request.BeerId,
        };

        oelContext.BeerLogs.Add(beerLog);
        await oelContext.SaveChangesAsync(cancellationToken);

        return Ok(beerLog);
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
            beerLog.Location = request.Location.Trim();
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
        return Ok(beerLog);
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
}
