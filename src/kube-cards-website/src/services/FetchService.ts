import userAuthService, { IUserAuthService } from "./UserAuthService";

export interface IFetchService {
    fetch(uri: string, request: RequestInit): Promise<Response>;
}

class UserAuthenticatedFetchService implements IFetchService {
    constructor(private readonly userAuthService: IUserAuthService) {
    }

    async fetch(uri: string, request: RequestInit): Promise<Response> {
        const authResponse = await this.userAuthService.aquireToken();

        // Clone the request (so that we can update the headers)...
        const updatedRequest = { ...request };

        // Clone the existing headers (if any) and insert the auth token...
        updatedRequest.headers = { ...(request.headers || {}), ['Authorization']: `Bearer ${authResponse.accessToken}` };

        return await fetch(uri, updatedRequest);
    }
}

const fetchService = new UserAuthenticatedFetchService(userAuthService);

export default fetchService;
