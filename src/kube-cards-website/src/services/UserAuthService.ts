import * as Msal from 'msal';

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

    private readonly requestObj = {
        scopes: ["openid"]
    };

    constructor(authority: string, clientId: string) {
        const msalConfig: Msal.Configuration = {
            auth: {
                authority,
                clientId
            },
            cache: {
                cacheLocation: 'localStorage',
                storeAuthStateInCookie: true
            }
        };

        this.myMSALObj = new Msal.UserAgentApplication(msalConfig);
    }

    async aquireToken(): Promise<UserAuthResponse> {
        try {
            return await this.myMSALObj.acquireTokenSilent(this.requestObj);
        }
        catch (err) {
            if (err.errorMessage.indexOf("interaction_required") !== -1) {
                return await this.myMSALObj.acquireTokenPopup(this.requestObj);
            }

            throw err;
        }
    }

    async login(): Promise<UserLoginResponse> {
        const response = await this.myMSALObj.loginPopup(this.requestObj);

        const { account, uniqueId: userId } = response;        
        const idToken: any = account.idToken;

        return {
            emails: idToken.emails || [],
            givenName: idToken.given_name,
            userId
        };
    }
}

const userAuthService: IUserAuthService = new MsalUserAuthService(process.env.REACT_APP_MSAL_AUTHORITY || '', process.env.REACT_APP_MSAL_CLIENT_ID || '');

export default userAuthService;