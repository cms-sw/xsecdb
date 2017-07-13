import { combineReducers } from 'redux';

import searchPageReducer from './containers/searchPage/searchPageReducer';

const rootReducer = combineReducers({searchPage: searchPageReducer});

export default rootReducer;