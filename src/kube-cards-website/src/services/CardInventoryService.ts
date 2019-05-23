import userAuthService, { IUserAuthService } from './UserAuthService';

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

        return [];
    }
}

const cardInventoryService = new KubeCardsInventoryService(
    process.env.REACT_APP_CARDS_INVENTORY_SERVICE_BASE_URI || '',
    userAuthService);

export default cardInventoryService;
