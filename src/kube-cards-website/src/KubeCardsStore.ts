import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import rootReducer from './reducers/RootReducer';

export default createStore(
    rootReducer,
    {} /* Initial state */,
    composeWithDevTools());
