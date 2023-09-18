using Microsoft.EntityFrameworkCore.Migrations;

namespace BudgetsService.Infrastructure.Extensions;

public static class MigrationBuilderExtension
{
    public static void SqlFile(this MigrationBuilder migrationBuilder, string path)
    {
        var currentDirectory = AppDomain.CurrentDomain.BaseDirectory;
        var sqlFile = Path.Combine(currentDirectory, path);
        var sqlToExecute = File.ReadAllText(sqlFile);
        migrationBuilder.Sql(sqlToExecute);
    }
}
    
