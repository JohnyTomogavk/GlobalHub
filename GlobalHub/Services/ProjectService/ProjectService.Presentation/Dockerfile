FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

COPY Directory.Build.props .
COPY stylecop.json .

COPY ["Services/ProjectService/ProjectService.Presentation/ProjectService.Presentation.csproj", "Services/ProjectService/ProjectService.Presentation/"]
COPY ["Services/Common/Common.csproj", "Services/Common/"]
COPY ["Services/ProjectService/ProjectService.Application/ProjectService.Application.csproj", "Services/ProjectService/ProjectService.Application/"]
COPY ["Services/ProjectService/ProjectService.Domain/ProjectService.Domain.csproj", "Services/ProjectService/ProjectService.Domain/"]
COPY ["Services/ProjectService/ProjectService.Persistence/ProjectService.Persistence.csproj", "Services/ProjectService/ProjectService.Persistence/"]
COPY ["Services/ProjectService/ProjectService.Infrastructure/ProjectService.Infrastructure.csproj", "Services/ProjectService/ProjectService.Infrastructure/"]

RUN dotnet restore "Services/ProjectService/ProjectService.Presentation/ProjectService.Presentation.csproj"
COPY . .

WORKDIR "/src/Services/ProjectService/ProjectService.Presentation"
RUN dotnet build "ProjectService.Presentation.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "ProjectService.Presentation.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjectService.Presentation.dll"]
