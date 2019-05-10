const appDrawer = (state = false, action: any) => {
    switch (action.type) {
        case 'OPEN_APP_DRAWER':
            return action.open;
    }

    return state;
};

export default appDrawer;
