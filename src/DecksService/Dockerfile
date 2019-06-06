FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["KubeCards.Common/KubeCards.Common.csproj", "KubeCards.Common/"]
COPY ["KubeCards.Models/KubeCards.Models.csproj", "KubeCards.Models/"]
COPY ["DecksService/DecksService.csproj", "DecksService/"]
RUN dotnet restore "DecksService/DecksService.csproj"
COPY . .
WORKDIR "/src/DecksService"
RUN dotnet build "DecksService.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "DecksService.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "DecksService.dll"]
