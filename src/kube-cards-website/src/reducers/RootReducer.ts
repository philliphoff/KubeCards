import { combineReducers } from 'redux';

import appDrawer from './AppDrawerReducer';
import userAuth from './UserAuthReducer';

export interface IRootStore {
    appDrawer: boolean;
    userAuth: boolean;
}

export default combineReducers({
    appDrawer,
    userAuth
});
