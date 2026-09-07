using Microsoft.AspNetCore.Mvc;
using Oel.Api.Context;
using Oel.Api.Models;

namespace Oel.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class BeerController(OelContext oelContext) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var beers = oelContext.Beers.ToList();
        return Ok(beers);
    }

    [HttpPost]
    public IActionResult Post([FromBody] Beer beer)
    {
        if (beer == null) { return BadRequest(); }
        
        try
        {
            oelContext.Beers.Add(beer);
            oelContext.SaveChanges();
            return Ok(beer);
        }
        catch (Exception ex)
        {
            return Problem(ex.Message);
        }
    }
}