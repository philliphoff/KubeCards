import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer, { IRootStore } from './reducers/RootReducer';

export interface IKubeCardsStore extends IRootStore {
}

export default createStore(
    rootReducer,
    {} /* Initial state */,
    composeWithDevTools(applyMiddleware(thunk)));
