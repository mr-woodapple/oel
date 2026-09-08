using Oel.Api.Enums;

namespace Oel.Api.Models;

public class BeerLog
{
    public int Id { get; set; }
        
    // 0 to 5 stars
    public double Rating { get; set; } 
        
    // Context
    public ServingFormats Format { get; set; }
    public string? LocationName { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public DateTimeOffset DateLogged { get; set; }

    // Optional photo stored separately from normal API responses.
    public byte[]? Photo { get; set; }
    public string? PhotoContentType { get; set; }

    // Foreign Key to the Beer
    public int BeerId { get; set; }
    public Beer? Beer { get; set; }
}
