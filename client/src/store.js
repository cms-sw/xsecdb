import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux'

import rootReducer from './rootReducer';

const history = createHistory();
const middleware = routerMiddleware(history)

const defaultState = {
    searchPage: {
        records: [],
        columns:[],
        searchField: ""
    },
    editPage: []
};

const enhancers = compose(
    applyMiddleware(...[middleware, thunk]),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(
    rootReducer,
    defaultState,
    enhancers
);

export { history };
export default store;




