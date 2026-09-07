using System.Text.Json.Serialization;

namespace Oel.Api.Models;

public class Beer
{
    public int Id { get; set; }
        
    // Core Identifiers
    public string Name { get; set; } = string.Empty;
    public string Brewery { get; set; } = string.Empty;
    public string Style { get; set; } = string.Empty;
    public double? Abv { get; set; }
    public int? Ibu { get; set; }
        
    // Experience
    public string? Appearance { get; set; }
    public string? TastingNotes { get; set; }
    public string? GeneralNotes { get; set; }

    // Navigation property for Entity Framework
    // public ICollection<BeerLog> Logs { get; set; } = new List<BeerLog>();
}   