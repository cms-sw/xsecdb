import { combineReducers } from 'redux';

import searchPageReducer from './containers/searchPage/searchPageReducer';
import editPageReducer from './containers/editPage/editPageReducer';

const rootReducer = combineReducers({searchPage: searchPageReducer, editPage: editPageReducer});

export default rootReducer;