#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:3.1 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:3.1 AS build
WORKDIR /src
COPY ["SmartEnergy.Documents/SmartEnergy.Documents.csproj", "SmartEnergy.Documents/"]
RUN dotnet restore "SmartEnergy.Documents/SmartEnergy.Documents.csproj"
COPY . .
WORKDIR "/src/SmartEnergy.Documents"
RUN dotnet build "SmartEnergy.Documents.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SmartEnergy.Documents.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SmartEnergy.Documents.dll"]