FROM mcr.microsoft.com/dotnet/aspnet:7.0-alpine AS base
WORKDIR /app
RUN apk add --no-cache icu-libs
ENV DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0-alpine AS build
WORKDIR /src

COPY Directory.Build.props .
COPY stylecop.json .

COPY ["Services/IdentityService/IdentityService.Presentation/IdentityService.Presentation.csproj", "Services/IdentityService/IdentityService.Presentation/"]
COPY ["Services/Common/Common.csproj", "Services/Common/"]
COPY ["Services/IdentityService/IdentityService.Domain/IdentityService.Domain.csproj", "Services/IdentityService/IdentityService.Domain/"]
COPY ["Services/IdentityService/IdentityService.Persistence/IdentityService.Persistence.csproj", "Services/IdentityService/IdentityService.Persistence/"]
COPY ["Services/IdentityService/IdentityService.Infrastructure/IdentityService.Infrastructure.csproj", "Services/IdentityService/IdentityService.Infrastructure/"]

RUN dotnet restore "Services/IdentityService/IdentityService.Presentation/IdentityService.Presentation.csproj"
COPY . .

WORKDIR "/src/Services/IdentityService/IdentityService.Presentation"
RUN dotnet build "IdentityService.Presentation.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "IdentityService.Presentation.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.Presentation.dll"]
