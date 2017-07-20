import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'

import searchPageReducer from './containers/searchPage/searchPageReducer';
import editPageReducer from './containers/editPage/editPageReducer';

const rootReducer = combineReducers({
    searchPage: searchPageReducer,
    editPage: editPageReducer,
    router: routerReducer
});

export default rootReducer;