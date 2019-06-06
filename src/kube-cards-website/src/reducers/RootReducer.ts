import { combineReducers } from 'redux';

import appDrawer from './AppDrawerReducer';
import userAuth, { IUserAuthStore } from './UserAuthReducer';
import play, { IPlayStore } from './PlayReducer';
import deck, { IDeckStore } from './DeckReducer';

export interface IRootStore {
    appDrawer: boolean;
    deck: IDeckStore;
    play: IPlayStore;
    userAuth: IUserAuthStore;
}

export default combineReducers({
    appDrawer,
    deck,
    play,
    userAuth
});
