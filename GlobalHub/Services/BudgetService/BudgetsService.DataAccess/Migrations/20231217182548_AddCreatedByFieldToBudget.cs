using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetsService.DataAccess.Migrations.IdentityDb
{
    /// <inheritdoc />
    public partial class AddCreatedByFieldToBudget : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Budgets",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Budgets");
        }
    }
}
