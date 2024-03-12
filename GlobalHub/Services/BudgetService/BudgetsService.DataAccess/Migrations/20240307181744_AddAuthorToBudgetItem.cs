using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetsService.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthorToBudgetItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "BudgetsItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "BudgetsItems",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "BudgetsItems");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "BudgetsItems");
        }
    }
}
