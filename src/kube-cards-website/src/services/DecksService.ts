import fetchService, { IFetchService } from "./FetchService";
import environmentService from "./EnvironmentService";
import { IDeck, ICard } from "../Models";

interface IGetDecksResponse {
    decks: IDeck[];
}

export interface IDecksService {
    createDeck(cards: ICard[]): Promise<IDeck>;
    createStarterDeck(): Promise<IDeck>;
    getDecks(): Promise<IDeck[]>;
}

class KubeCardsDecksService implements IDecksService {
    constructor(
        private readonly baseUri: string,
        private readonly fetchService: IFetchService) {
    }

    async createDeck(cards: ICard[]): Promise<IDeck> {
        const request: RequestInit = {
            body: JSON.stringify({ cards }),
            method: 'POST',
        };

        const response = await this.fetchService.fetch(
            `${this.baseUri}/api/decks`,
            request);

        const responseJson: IDeck = await response.json();

        return responseJson;
    }

    async createStarterDeck(): Promise<IDeck> {
        const request: RequestInit = {
            method: 'POST',
        };

        const response = await this.fetchService.fetch(
            `${this.baseUri}/api/decks/starter`,
            request);

        const responseJson: IDeck = await response.json();

        return responseJson;
    }

    async getDecks(): Promise<IDeck[]> {
        const request: RequestInit = {
            method: 'GET'
        };

        const response = await this.fetchService.fetch(
            `${this.baseUri}/api/decks`,
            request);

        const responseJson: IGetDecksResponse = await response.json();

        return responseJson.decks;
    }
}

const decksService: IDecksService = new KubeCardsDecksService(
    environmentService.getValue('DECKS_SERVICE_BASE_URI') || '',
    fetchService);

export default decksService;
