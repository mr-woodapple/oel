FROM node:24-alpine AS frontend-build
WORKDIR /src/frontend

COPY src/oel.frontend/package.json src/oel.frontend/package-lock.json ./
RUN npm ci

COPY src/oel.frontend/ ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS api-build
WORKDIR /src

COPY src/oel.api/Oel.Api.csproj src/oel.api/
RUN dotnet restore src/oel.api/Oel.Api.csproj

COPY src/oel.api/ src/oel.api/
RUN dotnet publish src/oel.api/Oel.Api.csproj \
    --configuration Release \
    --no-restore \
    --output /app/publish \
    /p:UseAppHost=false

COPY --from=frontend-build /src/frontend/dist/ /app/publish/wwwroot/

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

COPY --from=api-build --chown=$APP_UID:$APP_UID /app/publish/ ./

USER $APP_UID
ENTRYPOINT ["dotnet", "Oel.Api.dll"]
