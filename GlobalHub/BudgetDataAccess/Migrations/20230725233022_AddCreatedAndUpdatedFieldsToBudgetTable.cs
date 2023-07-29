using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetDataLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedAndUpdatedFieldsToBudgetTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Budgets",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "Budgets",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Budgets");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "Budgets");
        }
    }
}
