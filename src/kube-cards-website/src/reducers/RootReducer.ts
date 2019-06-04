import { combineReducers } from 'redux';

import appDrawer from './AppDrawerReducer';
import userAuth, { IUserAuthStore } from './UserAuthReducer';
import play, { IPlayStore } from './PlayReducer';

export interface IRootStore {
    appDrawer: boolean;
    play: IPlayStore;
    userAuth: IUserAuthStore;
}

export default combineReducers({
    appDrawer,
    play,
    userAuth
});
