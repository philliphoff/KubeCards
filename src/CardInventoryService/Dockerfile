FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["CardInventoryService/CardInventoryService.csproj", "CardInventoryService/"]
RUN dotnet restore "CardInventoryService/CardInventoryService.csproj"
COPY . .
WORKDIR "/src/CardInventoryService"
RUN dotnet build "CardInventoryService.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "CardInventoryService.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "CardInventoryService.dll"]
