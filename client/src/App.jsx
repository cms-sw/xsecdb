import React from 'react';
import {
    Route, Link, Switch, NavLink
} from 'react-router-dom';
import axios from 'axios';
import store from './store';

import SearchPage from './containers/searchPage/SearchPage';
import EditPage from './containers/editPage/EditPage';
import Alert from './components/Alert';

class App extends React.Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">XSDB</Link>
                        </div>
                    </div>
                </nav>
                <Switch>
                    <Route exact path="/" component={SearchPage} />
                    <Route path="/edit/:recordId?" component={EditPage} />
                    <Route component={ () => <h1>404: We can't find what you're looking for....</h1> } /> 
                </Switch>

                <Alert autoCloseTime={5000} />
            </div>
        )
    }

    //Get user roles
    componentWillMount() {
        axios.get('roles')
            .then(response => {
                store.dispatch({
                    type: "GET_USER_ROLES_SUCCESS",
                    roles: response.data
                })
            })
            .catch(error => {
                store.dispatch({
                    type: "SHOW_ALERT",
                    message: error.message,
                    status: "ERROR"
                })
            })
    }
}

export default App;