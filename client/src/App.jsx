import React from 'react';
import {
    Route, Link, Switch
} from 'react-router-dom';

import SearchPage from './containers/searchPage/SearchPage';

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={SearchPage} />
            <Route path="/about" render={() => <h1>About page</h1>} />
        </Switch>
    )
}



export default App;


