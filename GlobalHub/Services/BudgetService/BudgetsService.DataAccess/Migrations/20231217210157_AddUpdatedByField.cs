using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetsService.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddUpdatedByField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Budgets",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Budgets");
        }
    }
}
