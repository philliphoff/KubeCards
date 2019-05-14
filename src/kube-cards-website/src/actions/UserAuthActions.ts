import { Dispatch } from "redux";

export const userAuthLogin = (login: boolean) => ({
    type: 'KUBE_CARDS_USER_AUTH_LOGIN',
    login
});

export const userAuthMsalLogin = () => {
    return (dispatch: Dispatch) => {
        dispatch(userAuthLogin(true));
    };
};