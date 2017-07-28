import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import qs from 'query-string';
import { columnParameterName } from 'Config';

import InputField from '../../components/InputField';
import SimpleButton from '../../components/SimpleButton';
import Pagination from '../../components/Pagination';
import RecordList from '../../components/searchPage/RecordList';
import SearchBar from '../../components/searchPage/SearchBar';

import * as actionCreators from './actions';

class SearchPage extends React.Component {
    constructor(props) {
        super(props);

        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
        this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
        this.onClearButtonClick = this.onClearButtonClick.bind(this);
        this.onChangePagination = this.onChangePagination.bind(this);
    }

    render() {
        return (
            <div className="container">
                <SearchBar onSearchButtonClick={this.onSearchButtonClick} onSearchInputChange={this.onSearchInputChange}
                    searchFieldValue={this.props.searchField}
                    onClearButtonClick={this.onClearButtonClick}
                />
                <RecordList
                    records={this.props.records}
                    onDeleteButtonClick={this.onDeleteButtonClick}
                    columns={this.props.columns}
                    visibleColumnToggle={this.props.visibleColumnToggle}
                />
                <Pagination recordCount={this.props.records.length}
                    onChangePagination={this.onChangePagination}
                    {...this.props.pagination}
                />
            </div>
        )
    }

    componentDidMount() {
        //If there's any query parameters - use them in search
        const searchQuery = qs.parse(this.props.location.search);

        //Extract selected columns information
        const selectedColumns = searchQuery[columnParameterName];
        //Extract pagination information
        const { pageSize, currentPage } = searchQuery;

        //Leave only search information on searchQuery object
        delete searchQuery[columnParameterName];
        delete searchQuery['pageSize'];
        delete searchQuery['currentPage'];

        //If there's pagination information add it to application state
        if (currentPage && pageSize) {
            this.props.changePaginationState(currentPage, pageSize);
        }

        //Fetch records without updating url
        this.props.getInitialRecords(searchQuery);
        //Fetch columns and map with columns to display
        this.props.getRecordFields(selectedColumns);
        //Fill search field from url search params
        this.props.fillSearchInput(searchQuery);
    }

    onSearchButtonClick(e) {
        e.preventDefault();
        //Search action resets page to 0
        this.props.changePaginationState(0, this.props.pagination.pageSize)
        this.props.getFilteredRecords(this.props.searchField);
    }

    onClearButtonClick(e) {
        this.props.getFilteredRecords("");
        this.props.searchFieldChange("");
    }

    onSearchInputChange(e) {
        this.props.searchFieldChange(e.target.value);
    }

    onDeleteButtonClick(recordId, e) {
        this.props.deleteRecord(recordId);
    }

    onChangePagination(pageNumber, pageSize) {
        this.props.changePagination(pageNumber, pageSize);
        //request records using search query from searchfield and pagination parameters
        this.props.getFilteredRecords(this.props.searchField);
    }
}

const mapStateToProps = (state) => {
    return {
        search: state.searchPage,
        records: state.searchPage.records,
        columns: state.searchPage.columns,
        searchField: state.searchPage.searchField,
        pagination: state.searchPage.pagination
    }
}

const mapDispactchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispactchToProps)(SearchPage);