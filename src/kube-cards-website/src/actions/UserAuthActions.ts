import { Dispatch } from "redux";
import * as Msal from 'msal';

export const userAuthLogin = (state: 'loggedOut' | 'loggingIn' | 'loggedIn', error?: string) => ({
    type: 'KUBE_CARDS_USER_AUTH_LOGIN',
    state,
    error
});

const msalConfig: Msal.Configuration = {
    auth: {
        clientId: process.env.REACT_APP_MSAL_CLIENT_ID || '',
        authority: process.env.REACT_APP_MSAL_AUTHORITY || ''
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true
    }
};

const myMSALObj = new Msal.UserAgentApplication(msalConfig);

export const userAuthMsalLogin = () => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(userAuthLogin('loggingIn'));

            const requestObj = {
                scopes: ["openid"]
            };

            const response = await myMSALObj.loginPopup(requestObj);

            dispatch(userAuthLogin('loggedIn'));
        }
        catch (err) {
            dispatch(userAuthLogin('loggedOut', err.toString()));
        }
    };
};