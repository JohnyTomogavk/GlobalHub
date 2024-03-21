FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Services/NotificationService.API/NotificationService.API.csproj", "Services/NotificationService.API/"]
COPY ["Services/Common/Common.csproj", "Services/Common/"]
RUN dotnet restore "Services/NotificationService.API/NotificationService.API.csproj"
COPY . .
WORKDIR "/src/Services/NotificationService.API"
RUN dotnet build "NotificationService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NotificationService.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.API.dll"]