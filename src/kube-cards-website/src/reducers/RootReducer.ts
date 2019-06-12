import { combineReducers } from 'redux';

import appDrawer from './AppDrawerReducer';
import userAuth, { IUserAuthStore } from './UserAuthReducer';
import play, { IPlayStore } from './PlayReducer';
import decks, { IDecksStore } from './DecksReducer';
import games, { IGamesStore } from './GamesReducer';

export interface IRootStore {
    appDrawer: boolean;
    decks: IDecksStore;
    games: IGamesStore;
    play: IPlayStore;
    userAuth: IUserAuthStore;
}

export default combineReducers({
    appDrawer,
    decks,
    games,
    play,
    userAuth
});
