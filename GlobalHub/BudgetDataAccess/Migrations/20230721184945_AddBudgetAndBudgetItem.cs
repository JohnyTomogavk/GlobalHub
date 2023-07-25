using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BudgetDataLayer.Migrations
{
    /// <inheritdoc />
    public partial class AddBudgetAndBudgetItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Budgets",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BudgetTitle = table.Column<string>(type: "text", nullable: false),
                    BudgetDescription = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Budgets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BudgetsItems",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ItemTitle = table.Column<string>(type: "text", nullable: false),
                    ItemDescription = table.Column<string>(type: "text", nullable: false),
                    BudgetOperationType = table.Column<int>(type: "integer", nullable: false),
                    BudgetOperationCost = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    BudgetId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BudgetsItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BudgetsItems_Budgets_BudgetId",
                        column: x => x.BudgetId,
                        principalTable: "Budgets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BudgetsItems_BudgetId",
                table: "BudgetsItems",
                column: "BudgetId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BudgetsItems");

            migrationBuilder.DropTable(
                name: "Budgets");
        }
    }
}
