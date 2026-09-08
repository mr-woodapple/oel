using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Oel.Api.Context;

public sealed class OelContextFactory : IDesignTimeDbContextFactory<OelContext>
{
    public OelContext CreateDbContext(string[] args)
    {
        var workingDirectory = Directory.GetCurrentDirectory();
        var projectDirectory = Path.GetFileName(workingDirectory).Equals("oel.api", StringComparison.OrdinalIgnoreCase)
            ? workingDirectory
            : Path.Combine(workingDirectory, "src", "oel.api");

        var configuration = new ConfigurationBuilder()
            .SetBasePath(projectDirectory)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DatabaseConnection")
            ?? throw new InvalidOperationException("A DatabaseConnection connection string is required for EF tooling.");

        var options = new DbContextOptionsBuilder<OelContext>()
            .UseSqlServer(connectionString)
            .Options;

        return new OelContext(options);
    }
}
