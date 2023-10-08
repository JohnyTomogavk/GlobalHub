using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetsService.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class AddTagLimitsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TagLimits",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false),
                    MaxExpenseOperationsSum = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TagLimits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TagLimits_Tags_Id",
                        column: x => x.Id,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TagLimits");
        }
    }
}
