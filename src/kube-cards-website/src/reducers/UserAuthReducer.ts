const userAuth = (state = false, action: any) => {
    switch (action.type) {
        case 'KUBE_CARDS_USER_AUTH_LOGIN':
            return action.login;
    }

    return state;
};

export default userAuth;
