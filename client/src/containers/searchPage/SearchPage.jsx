import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InputField from '../../components/InputField';
import SimpleButton from '../../components/SimpleButton';
import RecordList from '../../components/searchPage/RecordList';
import * as actionCreators from './actions';

import { recordList } from '../../mockData/data';

class SearchPage extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="form-inline">
                    <InputField placeholder={"Search query..."} id="searchField" />
                    <SimpleButton onClick={this.onSearchButtonClick} text="Search" />
                </div>
                <RecordList records={recordList} />
            </div>
        )
    }

    onSearchButtonClick() {
        console.log("Search !")
    }
}

const mapStateToProps = (state) => {
    return {
        search: state.searchPage
    }
}

const mapDispactchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispactchToProps)(SearchPage);