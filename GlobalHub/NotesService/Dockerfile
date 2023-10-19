FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

COPY NotesService/ ./NotesService
COPY Common/ ./Common
RUN dotnet build -c Release NotesService/NotesService.csproj

FROM build as publish
RUN dotnet publish -c Release NotesService/NotesService.csproj -o publish --no-restore --no-build

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS final
WORKDIR /app
COPY --from=publish /app/publish ./

EXPOSE 80 443

ENTRYPOINT ["dotnet", "NotesService.dll"]
