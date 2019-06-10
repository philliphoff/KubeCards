import { combineReducers } from 'redux';

import appDrawer from './AppDrawerReducer';
import userAuth, { IUserAuthStore } from './UserAuthReducer';
import play, { IPlayStore } from './PlayReducer';
import decks, { IDecksStore } from './DecksReducer';

export interface IRootStore {
    appDrawer: boolean;
    decks: IDecksStore;
    play: IPlayStore;
    userAuth: IUserAuthStore;
}

export default combineReducers({
    appDrawer,
    decks,
    play,
    userAuth
});
