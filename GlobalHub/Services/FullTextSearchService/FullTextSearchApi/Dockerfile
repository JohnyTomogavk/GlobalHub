FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Services/FullTextSearchService/FullTextSearchApi/FullTextSearchApi.csproj", "Services/FullTextSearchService/FullTextSearchApi/"]
RUN dotnet restore "Services/FullTextSearchService/FullTextSearchApi/FullTextSearchApi.csproj"
COPY . .
WORKDIR "/src/Services/FullTextSearchService/FullTextSearchApi"
RUN dotnet build "FullTextSearchApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "FullTextSearchApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "FullTextSearchApi.dll"]
