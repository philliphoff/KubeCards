import environmentService from './EnvironmentService';
import userAuthService, { IUserAuthService } from './UserAuthService';

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
        private readonly userAuthService: IUserAuthService) {
    }

    async getCards(): Promise<[]> {
        const authResponse = await this.userAuthService.aquireToken();

        const request: RequestInit = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authResponse.accessToken}`
            }
        };

        const response = await fetch(
            `${this.baseUri}/api/cards`,
            request);

        const responseJson: IGetCardsResponse = await response.json();

        return responseJson.cards;
    }
}

const cardInventoryService: ICardInventoryService = new KubeCardsInventoryService(
    environmentService.getValue('CARDS_INVENTORY_SERVICE_BASE_URI') || '',
    userAuthService);

export default cardInventoryService;
