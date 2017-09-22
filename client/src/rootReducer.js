import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import searchPageReducer from './containers/searchPage/searchPageReducer';
import editPageReducer from './containers/editPage/editPageReducer';
import utilsReducer from './containers/utils/utilsReducer';
import authReducer from './auth/authReducer';

const rootReducer = combineReducers({
    searchPage: searchPageReducer,
    editPage: editPageReducer,
    utils: utilsReducer,
    router: routerReducer,
    auth: authReducer
});

export default rootReducer;