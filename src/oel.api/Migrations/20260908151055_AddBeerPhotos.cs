using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Oel.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBeerPhotos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "Photo",
                table: "Beers",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoContentType",
                table: "Beers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "Photo",
                table: "BeerLogs",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoContentType",
                table: "BeerLogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Photo",
                table: "Beers");

            migrationBuilder.DropColumn(
                name: "PhotoContentType",
                table: "Beers");

            migrationBuilder.DropColumn(
                name: "Photo",
                table: "BeerLogs");

            migrationBuilder.DropColumn(
                name: "PhotoContentType",
                table: "BeerLogs");
        }
    }
}
