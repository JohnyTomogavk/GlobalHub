FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine AS base
WORKDIR /app
RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build
WORKDIR /src

COPY ["IdentityService/IdentityService.Presentation/IdentityService.Presentation.csproj", "IdentityService/IdentityService.Presentation/"]
COPY ["Common/Common.csproj", "Common/"]
COPY ["IdentityService/IdentityService.Domain/IdentityService.Domain.csproj", "IdentityService/IdentityService.Domain/"]
COPY ["IdentityService/IdentityService.Persistence/IdentityService.Persistence.csproj", "IdentityService/IdentityService.Persistence/"]
COPY ["IdentityService/IdentityService.Infrastructure/IdentityService.Infrastructure.csproj", "IdentityService/IdentityService.Infrastructure/"]

RUN dotnet restore "IdentityService/IdentityService.Presentation/IdentityService.Presentation.csproj"
COPY . .

WORKDIR "/src/IdentityService/IdentityService.Presentation"
RUN dotnet build "IdentityService.Presentation.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IdentityService.Presentation.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.Presentation.dll"]
