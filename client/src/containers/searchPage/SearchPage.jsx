import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import qs from 'query-string';
import { columnParameterName } from 'Config';

import InputField from '../../components/InputField';
import SimpleButton from '../../components/SimpleButton';
import RecordList from '../../components/searchPage/RecordList';
import SearchBar from '../../components/searchPage/SearchBar';

import * as actionCreators from './actions';

class SearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
        this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
    }

    render() {
        return (
            <div className="container">
                <SearchBar onSearchButtonClick={this.onSearchButtonClick} onSearchInputChange={this.onSearchInputChange} 
                    searchFieldValue={this.props.searchField}
                />
                <RecordList
                    records={this.props.records}
                    onDeleteButtonClick={this.onDeleteButtonClick}
                    columns={this.props.columns}
                    visibleColumnToggle={this.props.visibleColumnToggle}
                />
            </div>
        )
    }

    componentDidMount() {
        //If there's any query parameters - use them in search
        const searchQuery = qs.parse(this.props.location.search);
        const selectedColumns = searchQuery[columnParameterName];
        delete searchQuery[columnParameterName];

        this.props.getInitialRecords(searchQuery);
        this.props.getRecordFields(selectedColumns);

        this.props.fillSearchInput(searchQuery);
    }

    onSearchButtonClick(e) {
        e.preventDefault();
        this.props.getFilteredRecords(this.props.searchField);
    }

    onSearchInputChange(e) {
        this.props.searchFieldChange(e.target.value);
    }

    onDeleteButtonClick(recordId, e) {
        this.props.deleteRecord(recordId);
    }
}

const mapStateToProps = (state) => {
    return {
        search: state.searchPage,
        records: state.searchPage.records,
        columns: state.searchPage.columns,
        searchField: state.searchPage.searchField
    }
}

const mapDispactchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispactchToProps)(SearchPage);