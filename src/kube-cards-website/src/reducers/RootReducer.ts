import { combineReducers } from 'redux';

import appDrawer from './AppDrawerReducer';
import userAuth from './UserAuthReducer';

export default combineReducers({
    appDrawer,
    userAuth
});
