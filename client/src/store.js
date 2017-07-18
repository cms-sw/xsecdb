import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './rootReducer';

const defaultState = {
    searchPage: {
        records: []
    },
    editPage: []
};

const store = createStore(
    rootReducer,
    defaultState,
    applyMiddleware(thunk)
);

export default store;




