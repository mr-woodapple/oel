using Microsoft.AspNetCore.Mvc;
using Oel.Api.Context;
using Oel.Api.Models;

namespace Oel.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BeerLogController(OelContext oelContext) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var logs = oelContext.BeerLogs.ToList();
        return Ok(logs);
    }

    [HttpPost]
    public IActionResult Post([FromBody] BeerLog beerLog)
    {
        try
        {
            oelContext.BeerLogs.Add(beerLog);
            oelContext.SaveChanges();
            return Ok(beerLog);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}