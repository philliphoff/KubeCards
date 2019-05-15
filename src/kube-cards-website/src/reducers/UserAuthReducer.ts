import { combineReducers } from "redux";

const state = (state = 'loggedOut', action: any) => {
    switch (action.type) {
        case 'KUBE_CARDS_USER_AUTH_LOGIN':
            return action.state;
    }

    return state;
};

const lastError = (state = '', action: any) => {
    switch (action.type) {
        case 'KUBE_CARDS_USER_AUTH_LOGIN':
            return action.error || '';
    }

    return state;
};

export interface IUserAuthStore {
    state: 'loggedOut' | 'loggingIn' | 'loggedIn';
    lastError: string;
}

export default combineReducers({
    state,
    lastError
});
