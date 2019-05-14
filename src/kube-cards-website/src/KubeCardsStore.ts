import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import rootReducer from './reducers/RootReducer';

export default createStore(
    rootReducer,
    {} /* Initial state */,
    composeWithDevTools(applyMiddleware(thunk)));
