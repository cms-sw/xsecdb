import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import searchPageReducer from './containers/searchPage/searchPageReducer';
import editPageReducer from './containers/editPage/editPageReducer';
import utilsReducer from './containers/utils/utilsReducer';

const rootReducer = combineReducers({
    searchPage: searchPageReducer,
    editPage: editPageReducer,
    utils: utilsReducer,
    router: routerReducer
});

export default rootReducer;