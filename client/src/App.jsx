import React from 'react';
import {
    Route, Link, Switch, NavLink
} from 'react-router-dom';

import SearchPage from './containers/searchPage/SearchPage';
import EditPage from './containers/editPage/EditPage';

const App = () => {
    return (
        <div>
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link to="/" className="navbar-brand">XSDB</Link>
                    </div>
                    <ul className="nav navbar-nav">
                        <li><NavLink to="/">Search</NavLink></li>
                        <li><NavLink to="/users">Users test</NavLink></li>
                    </ul>
                </div>
            </nav>
            <Switch>
                <Route exact path="/" component={SearchPage} />
                <Route path="/edit/:recordId?" component={EditPage} />
                <Route path="/about" render={() => <h1>About page</h1>} />
                {/* TODO 404 */}
            </Switch>
        </div>
    )
}



export default App;


