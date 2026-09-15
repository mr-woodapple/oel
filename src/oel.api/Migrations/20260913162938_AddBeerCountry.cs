using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Oel.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddBeerCountry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CountryCode",
                table: "Beers",
                type: "varchar(2)",
                unicode: false,
                maxLength: 2,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CountryCode",
                table: "Beers");
        }
    }
}
