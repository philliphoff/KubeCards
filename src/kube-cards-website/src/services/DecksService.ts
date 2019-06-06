import fetchService, { IFetchService } from "./FetchService";
import environmentService from "./EnvironmentService";

interface IGetDecksResponse {
    decks: [];
}

export interface IDecksService {
    getDecks(): Promise<[]>;
}

class KubeCardsDecksService implements IDecksService {
    constructor(
        private readonly baseUri: string,
        private readonly fetchService: IFetchService) {
    }

    async getDecks(): Promise<[]> {
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
