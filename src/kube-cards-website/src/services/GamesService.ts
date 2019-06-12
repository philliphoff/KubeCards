import { IGameState } from "../Models";
import fetchService, { IFetchService } from "./FetchService";
import environmentService from "./EnvironmentService";

export interface IGamesService {
    createGame(deckId: string): Promise<IGameState>;
    getGame(gameId: string): Promise<IGameState>;
    getGames(): Promise<IGameState[]>;
    playCard(gameId: string, cardId: string): Promise<IGameState>;
}

class KubeCardsGamesService implements IGamesService {
    constructor(
        private readonly baseUri: string,
        private readonly fetchService: IFetchService) {
    }

    createGame(deckId: string): Promise<IGameState> {
        return this.post<IGameState>(undefined, deckId);
    }
    
    getGame(gameId: string): Promise<IGameState> {
        return this.get<IGameState>(gameId);
    }

    getGames(): Promise<IGameState[]> {
        return this.get<IGameState[]>();
    }

    playCard(gameId: string, cardId: string): Promise<IGameState> {
        return this.post<IGameState>(`${gameId}/play`, cardId);
    }

    private async get<T>(relativeUri?: string): Promise<T> {
        const request: RequestInit = {
            method: 'GET'
        };

        const uri = relativeUri
            ? `${this.baseUri}/api/games/${relativeUri}`
            : `${this.baseUri}/api/games`;

        const response = await this.fetchService.fetch(
            uri,
            request);

        const responseJson: T = await response.json();

        return responseJson;
    }

    private async post<T>(relativeUri?: string, body?: any): Promise<T> {
        const request: RequestInit = {
            body: body !== undefined ? JSON.stringify(body) : undefined,
            method: 'POST'
        };

        const uri = relativeUri
            ? `${this.baseUri}/api/games/${relativeUri}`
            : `${this.baseUri}/api/games`;

        const response = await this.fetchService.fetch(
            uri,
            request);

        const responseJson: T = await response.json();

        return responseJson;
    }
}

const gamesService: IGamesService = new KubeCardsGamesService(
    environmentService.getValue('GAMES_SERVICE_BASE_URI') || '',
    fetchService);

export default gamesService;
