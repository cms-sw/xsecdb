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
                            <a href="https://twiki.cern.ch/twiki/bin/view/CMS/XSecDBTool" className="navbar-text text-dark">TWiki</a>
                            <a href="https://its.cern.ch/jira/projects/XSDB" className="navbar-text">Jira</a>
                            <a href="https://twiki.cern.ch/twiki/bin/view/CMS/HowToGenXSecAnalyzer" className="navbar-text">GenXsecAnalyzer</a>
                            <a href="https://twiki.cern.ch/twiki/bin/view/CMS/GenXsecTaskForce#Xsec_Tables_for_reference" className="navbar-text">Reference results</a>
                            <a href="https://twiki.cern.ch/twiki/bin/view/CMS/MCKnownIssues" className="navbar-text" title="Known issues from GEN">Known issues</a>
                        </div>
                    </div>
                </nav>
                <Switch>
                    <Route exact path="/" component={SearchPage} />
                    {/* <Route path="/edit/:recordId?" component={EditPage} /> */}
                    <Route component={ () => <h1>404: We cannot find what you are looking for...</h1> } /> 
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