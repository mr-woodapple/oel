var builder = DistributedApplication.CreateBuilder(args);

var database = builder.AddSqlServer("sql")
    .WithImageTag("2025-latest")
    .AddDatabase("OelDatabase");

builder.AddSqlProject("OelDatabase-schema")
    .WithDacpac("./Database/OelDatabase.dacpac")
    .WithReference(database);

var api = builder.AddProject<Projects.oel_api>("oel-api", launchProfileName: "https")
    .WithReference(database)
    .WaitFor(database);

var frontend = builder
    .AddViteApp("oel-frontend", "../oel.frontend/");

builder.Build().Run();