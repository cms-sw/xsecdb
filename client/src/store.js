import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux'

import rootReducer from './rootReducer';

const history = createHistory();
const middleware = routerMiddleware(history)

const defaultState = {
    searchPage: {
        records: []
    },
    editPage: []
};

const store = createStore(
    rootReducer,
    defaultState,
    applyMiddleware(...[middleware, thunk])
);

export { history };
export default store;




