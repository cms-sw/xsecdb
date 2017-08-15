import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory';
import { routerMiddleware } from 'react-router-redux'

import rootReducer from './rootReducer';

const history = createHistory({ basename: '/xsdb' });
const routerware = routerMiddleware(history);

const defaultState = {
    searchPage: {
        records: [],
        columns: [],
        selected: [],
        searchField: "",
        pagination: { pageSize: 10, currentPage: 0 }
    },
    editPage: [],
    utils: {
        message: ""
    },
    auth: {
        roles: []
    }
};

// Redux dev plugin only in development env
let enhancers;
if (process.env.NODE_ENV === 'production') {
    enhancers = compose(
        applyMiddleware(...[routerware, thunk])
    );
} else {
    enhancers = compose(
        applyMiddleware(...[routerware, thunk]),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    );
}

const store = createStore(
    rootReducer,
    defaultState,
    enhancers
);

export { history };
export default store;