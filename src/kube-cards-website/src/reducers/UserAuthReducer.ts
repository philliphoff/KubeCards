export interface IUserAuthStore {
    emails?: string[];
    givenName?: string;
    lastError?: string;
    state: 'loggedOut' | 'loggingIn' | 'loggedIn';
    userId?: string;
}

const userAuthReducer = (state: IUserAuthStore = { state: 'loggedOut'}, action: any): IUserAuthStore => {
    switch (action.type) {
        case 'KUBE_CARDS_USER_AUTH_LOGIN_START':
            return ({ state: 'loggingIn' });
        case 'KUBE_CARDS_USER_AUTH_LOGIN_COMPLETE':
            return ({ state: 'loggedIn', emails: action.emails, givenName: action.givenName, userId: action.userId });
        case 'KUBE_CARDS_USER_AUTH_LOGIN_ERROR':
            return ({ state: 'loggedOut', lastError: action.error });
        case 'KUBE_CARDS_USER_AUTH_LOGOUT':
            return ({ state: 'loggedOut' });
    }

    return state;
};

export default userAuthReducer;
