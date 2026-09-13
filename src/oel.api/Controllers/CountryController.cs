using Microsoft.AspNetCore.Mvc;
using Oel.Api.Services;

namespace Oel.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class CountryController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<string>> Get() => Ok(CountryCatalog.Codes);
}
