using Microsoft.EntityFrameworkCore;
using Oel.Api.Models;

namespace Oel.Api.Context;

public class OelContext(DbContextOptions<OelContext> options) : DbContext(options)
{
    public DbSet<Beer> Beers { get; set; } = default!;
    public DbSet<BeerLog> BeerLogs { get; set; } = default!;
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Beer>()
            .Property(beer => beer.CountryCode)
            .HasMaxLength(2)
            .IsUnicode(false);

        modelBuilder.Entity<Beer>()
            .Property(beer => beer.PhotoContentType)
            .HasMaxLength(50);

        modelBuilder.Entity<BeerLog>()
            .Property(beerLog => beerLog.PhotoContentType)
            .HasMaxLength(50);
    }
}
