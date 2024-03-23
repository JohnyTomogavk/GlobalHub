FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build
WORKDIR /app

COPY Directory.Build.props .
COPY stylecop.json .

COPY Services/NotesService/ ./NotesService
COPY Services/Common/ ./Common
RUN dotnet build -c Release NotesService/NotesService.csproj

FROM build as publish
RUN dotnet publish -c Release NotesService/NotesService.csproj -o publish --no-restore --no-build

FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine AS final
WORKDIR /app
COPY --from=publish /app/publish ./

EXPOSE 80 443

ENTRYPOINT ["dotnet", "NotesService.dll"]
