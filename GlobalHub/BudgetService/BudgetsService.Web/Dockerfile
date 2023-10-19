FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

COPY BudgetService/ ./BudgetService
COPY Common/ ./Common
RUN dotnet build -c Release BudgetService/BudgetService.sln

FROM build as publish
RUN dotnet publish -c Release BudgetService/BudgetService.sln -o publish --no-restore --no-build

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish ./

EXPOSE 80 443

ENTRYPOINT ["dotnet", "BudgetsService.Web.dll"]
