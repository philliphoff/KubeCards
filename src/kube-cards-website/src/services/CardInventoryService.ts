import environmentService from './EnvironmentService';
import fetchService, { IFetchService } from './FetchService';

interface IGetCardsResponse {
    userId: string;
    cards: [];
}

export interface ICardInventoryService {
    getCards(): Promise<[]>;
}

class KubeCardsInventoryService implements ICardInventoryService {
    constructor(
        private readonly baseUri: string,
        private readonly fetchService: IFetchService) {
    }

    async getCards(): Promise<[]> {
        const request: RequestInit = {
            method: 'GET'
        };

        const response = await this.fetchService.fetch(
            `${this.baseUri}/api/cards`,
            request);

        const responseJson: IGetCardsResponse = await response.json();

        return responseJson.cards;
    }
}

const cardInventoryService: ICardInventoryService = new KubeCardsInventoryService(
    environmentService.getValue('CARDS_INVENTORY_SERVICE_BASE_URI') || '',
    fetchService);

export default cardInventoryService;
