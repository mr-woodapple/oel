using Microsoft.EntityFrameworkCore;
using Oel.Api.Context;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure database connection
builder.Services.AddDbContext<OelContext>(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("DatabaseConnection")));

// Configuring CORS (only for local development)
#if DEBUG
builder.Services.AddCors(options =>
{
    options.AddPolicy("OelFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
#endif

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors("OelFrontend");
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGroup("/api").MapControllers();
app.MapFallback("/api/{**path}", () => Results.NotFound());
app.MapFallbackToFile("index.html");

// Apply migrations automatically on startup
using (IServiceScope scope = app.Services.CreateScope())
{
    Console.WriteLine("Applying migrations...");
    var db = scope.ServiceProvider.GetRequiredService<OelContext>();
    db.Database.Migrate();
}

app.Run();
