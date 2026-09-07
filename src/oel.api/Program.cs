using Microsoft.EntityFrameworkCore;
using Oel.Api.Context;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure database connection
builder.Services.AddDbContext<OelContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DatabaseConnection")));

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

app.UsePathBase(new PathString("/api"));
app.MapControllers();

// Apply migrations automatically on startup
using (IServiceScope scope = app.Services.CreateScope())
{
    Console.WriteLine("Applying migrations...");
    Console.WriteLine($"Connection string used: {builder.Configuration.GetConnectionString("DatabaseConnection")}");
    var db = scope.ServiceProvider.GetRequiredService<OelContext>();
    db.Database.Migrate();
}

app.Run();
