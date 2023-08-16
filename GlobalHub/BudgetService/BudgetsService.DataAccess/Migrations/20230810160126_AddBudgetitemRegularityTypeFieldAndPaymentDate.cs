using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetDataLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddBudgetitemRegularityTypeFieldAndPaymentDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BudgetOperationType",
                table: "BudgetsItems",
                newName: "BudgetItemRegularityType");

            migrationBuilder.AddColumn<int>(
                name: "BudgetItemOperationType",
                table: "BudgetsItems",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaymentDate",
                table: "BudgetsItems",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BudgetItemOperationType",
                table: "BudgetsItems");

            migrationBuilder.DropColumn(
                name: "PaymentDate",
                table: "BudgetsItems");

            migrationBuilder.RenameColumn(
                name: "BudgetItemRegularityType",
                table: "BudgetsItems",
                newName: "BudgetOperationType");
        }
    }
}
