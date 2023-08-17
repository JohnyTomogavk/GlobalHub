using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BudgetsService.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddTagRelatedtables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "TagId",
                table: "BudgetsItems",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PreserveFromIncomingPercent",
                table: "Budgets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Label = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    BudgetId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tag_Budgets_BudgetId",
                        column: x => x.BudgetId,
                        principalTable: "Budgets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BudgetItemTags",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TagId = table.Column<long>(type: "bigint", nullable: false),
                    BudgetItemId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BudgetItemTags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BudgetItemTags_BudgetsItems_BudgetItemId",
                        column: x => x.BudgetItemId,
                        principalTable: "BudgetsItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BudgetItemTags_Tag_TagId",
                        column: x => x.TagId,
                        principalTable: "Tag",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BudgetsItems_TagId",
                table: "BudgetsItems",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_BudgetItemTags_BudgetItemId",
                table: "BudgetItemTags",
                column: "BudgetItemId");

            migrationBuilder.CreateIndex(
                name: "IX_BudgetItemTags_TagId",
                table: "BudgetItemTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Tag_BudgetId",
                table: "Tag",
                column: "BudgetId");

            migrationBuilder.AddForeignKey(
                name: "FK_BudgetsItems_Tag_TagId",
                table: "BudgetsItems",
                column: "TagId",
                principalTable: "Tag",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BudgetsItems_Tag_TagId",
                table: "BudgetsItems");

            migrationBuilder.DropTable(
                name: "BudgetItemTags");

            migrationBuilder.DropTable(
                name: "Tag");

            migrationBuilder.DropIndex(
                name: "IX_BudgetsItems_TagId",
                table: "BudgetsItems");

            migrationBuilder.DropColumn(
                name: "TagId",
                table: "BudgetsItems");

            migrationBuilder.DropColumn(
                name: "PreserveFromIncomingPercent",
                table: "Budgets");
        }
    }
}
