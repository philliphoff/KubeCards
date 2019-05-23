import * as Msal from 'msal';

import environmentService from './EnvironmentService';

export interface UserLoginResponse {
    emails: string[];
    givenName: string;
    userId: string;
}

export interface UserAuthResponse {
    accessToken: string;
}

export interface IUserAuthService {
    aquireToken(): Promise<UserAuthResponse>;
    login(): Promise<UserLoginResponse>;
}

class MsalUserAuthService implements IUserAuthService {
    private readonly myMSALObj: Msal.UserAgentApplication;

    private readonly loginRequestObj = {
        scopes: ['openid']
    };

    private readonly tokenRequestObj: Msal.AuthenticationParameters;

    constructor(authority: string, clientId: string, impersonationScope: string) {
        const msalConfig: Msal.Configuration = {
            auth: {
                authority,
                clientId,
                validateAuthority: false
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            }
        };

        this.tokenRequestObj = {
            scopes: [ impersonationScope ]
        };

        this.myMSALObj = new Msal.UserAgentApplication(msalConfig);
    }

    async aquireToken(): Promise<UserAuthResponse> {
        try {
            return await this.myMSALObj.acquireTokenSilent(this.tokenRequestObj);
        }
        catch (err) {
            if (err.errorMessage.indexOf("interaction_required") !== -1) {
                return await this.myMSALObj.acquireTokenPopup(this.tokenRequestObj);
            }

            throw err;
        }
    }

    async login(): Promise<UserLoginResponse> {
        const response = await this.myMSALObj.loginPopup(this.loginRequestObj);

        const { account, uniqueId: userId } = response;        
        const idToken: any = account.idToken;

        return {
            emails: idToken.emails || [],
            givenName: idToken.given_name,
            userId
        };
    }
}

const userAuthService: IUserAuthService = new MsalUserAuthService(
    environmentService.getValue('MSAL_AUTHORITY') || '',
    environmentService.getValue('MSAL_CLIENT_ID') || '',
    environmentService.getValue('MSAL_IMPERSONATION_SCOPE') || '');

export default userAuthService;