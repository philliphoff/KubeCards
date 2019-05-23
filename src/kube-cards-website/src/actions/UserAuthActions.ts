import { Dispatch } from "redux";

import userAuthService from '../services/UserAuthService';
import cardInventoryService from '../services/CardInventoryService';

export const userAuthLoginStart= () => ({
    type: 'KUBE_CARDS_USER_AUTH_LOGIN_START'
});

export const userAuthLoginComplete = (userId: string, givenName: string, emails: string[]) => ({
    type: 'KUBE_CARDS_USER_AUTH_LOGIN_COMPLETE',
    emails,
    givenName,
    userId
});

export const userAuthLoginError = (error: string) => ({
    type: 'KUBE_CARDS_USER_AUTH_LOGIN_ERROR',
    error
});

export const userAuthLogout = () => ({
    type: 'KUBE_CARDS_USER_AUTH_LOGOUT'
});

export const userAuthCards = (cards: []) => ({
    type: 'KUBE_CARDS_USER_AUTH_CARDS',
    cards
});

export const userAuthGetCards = () => {
    return async (dispatch: Dispatch) => {
        var cards = await cardInventoryService.getCards();

        dispatch(userAuthCards(cards));
    };
}

export const userAuthMsalLogin = () => {
    return async (dispatch: any) => {
        try {
            dispatch(userAuthLoginStart());

            const { emails, givenName, userId } = await userAuthService.login();

            dispatch(userAuthLoginComplete(userId, givenName, emails));

            dispatch(userAuthGetCards());
        }
        catch (err) {
            dispatch(userAuthLoginError(err.toString()));
        }
    };
};

export const userAuthMsalLogout = () => {
    return async (dispatch: Dispatch) => {
        dispatch(userAuthLogout());
    };
};
