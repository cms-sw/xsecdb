import React from 'react';
import {
    Route, Link, Switch
} from 'react-router-dom';

import SearchPage from './containers/searchPage/SearchPage';
import EditPage from './containers/editPage/EditPage';

const App = () => {
    return (
        <Switch>
            <Route exact path="/" component={SearchPage} />
            <Route path="/edit/:recordId?" component={EditPage} />
            <Route path="/about" render={() => <h1>About page</h1>} />
            {/* TODO 404 */}
        </Switch>
    )
}



export default App;


