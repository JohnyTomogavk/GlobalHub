using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetsService.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBudgetItemColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PaymentDate",
                table: "BudgetsItems",
                newName: "OperationDate");

            migrationBuilder.RenameColumn(
                name: "BudgetOperationCost",
                table: "BudgetsItems",
                newName: "OperationCost");

            migrationBuilder.AlterColumn<string>(
                name: "ItemDescription",
                table: "BudgetsItems",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OperationDate",
                table: "BudgetsItems",
                newName: "PaymentDate");

            migrationBuilder.RenameColumn(
                name: "OperationCost",
                table: "BudgetsItems",
                newName: "BudgetOperationCost");

            migrationBuilder.AlterColumn<string>(
                name: "ItemDescription",
                table: "BudgetsItems",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
