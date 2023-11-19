using BudgetsService.Infrastructure.Extensions;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BudgetsService.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ChangeTagColorColumnTypeToInteger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.SqlFile("Migrations//20230907193621_ChangeTagColorColumnTypeToInteger.sql");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Do nothing
        }
    }
}
