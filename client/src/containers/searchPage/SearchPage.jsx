import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InputField from '../../components/InputField';
import SimpleButton from '../../components/SimpleButton';
import RecordList from '../../components/searchPage/RecordList';
import SearchBar from '../../components/searchPage/SearchBar';

import * as actionCreators from './actions';

import { recordList } from '../../mockData/data';

class SearchPage extends React.Component {
    constructor(props){
        super(props);

        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
    }

    render() {
        return (
            <div className="container">
                <SearchBar onSearchButtonClick={this.onSearchButtonClick} onSearchInputChange={this.onSearchInputChange} />
                <RecordList records={this.props.search.records} />
            </div>
        )
    }

    componentDidMount() {
        this.props.getAllRecords();
    }

    onSearchButtonClick() {
        this.props.getFilteredRecords(this.props.searchField)
    }

    onSearchInputChange(e){
        this.props.searchFieldChange(e.target.value);
    }
}

const mapStateToProps = (state) => {
    return {
        search: state.searchPage,
        searchField: state.searchPage.searchField
    }
}

const mapDispactchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispactchToProps)(SearchPage);