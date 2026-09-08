using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Oel.Api.Migrations
{
    /// <inheritdoc />
    public partial class StoreBeerLogCoordinates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Location",
                table: "BeerLogs",
                newName: "LocationName");

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "BeerLogs",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "BeerLogs",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "BeerLogs");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "BeerLogs");

            migrationBuilder.RenameColumn(
                name: "LocationName",
                table: "BeerLogs",
                newName: "Location");
        }
    }
}
