import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import qs from 'query-string';
import { columnParameterName } from 'Config';

import Pagination from '../../components/Pagination';
import RecordList from '../../components/searchPage/RecordList';
import SearchBar from '../../components/searchPage/SearchBar';

import Alert from '../../components/Alert';

import * as actionCreators from './actions';

class SearchPage extends React.Component {
    render() {
        return (
            <div style={{ margin: "0 2%" }}>
                <SearchBar onSearchButtonClick={this.onSearchButtonClick} onSearchInputChange={this.onSearchInputChange}
                    searchFieldValue={this.props.searchField || ""}
                    onClearButtonClick={this.onClearButtonClick}
                />
                <RecordList
                    records={this.props.records}
                    columns={this.props.columns}
                    selectedRows={this.props.selectedRows}
                    orderBy={this.props.orderBy}

                    onDeleteButtonClick={this.onDeleteButtonClick}
                    onToggleSelectedRow={this.onToggleSelectedRow}
                    onToggleSelectAllRows={this.onToggleSelectAllRows}
                    onApproveRecordsClick={this.onApproveRecordsClick}
                    visibleColumnToggle={this.props.visibleColumnToggle}
                    onColumnHeaderClick={this.onColumnHeaderClick}
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
        const urlParams = qs.parse(this.props.location.search);
        //Extract selected columns information
        const selectedColumns = urlParams[columnParameterName];
        //Take pagination info, search query and ordering info
        const { pageSize, currentPage, searchQuery, ordFieldName, ordDirection } = urlParams;

        //If there's pagination information add it to application state
        if (currentPage && pageSize) {
            this.props.changePaginationState(currentPage, pageSize);
        }

        if (ordFieldName && ordDirection) {
            this.props.changeOrderBy(ordFieldName, ordDirection)
        }

        //Fetch columns and map with columns to display
        this.props.getRecordFields(selectedColumns);
        //Fill search field from url search params
        this.props.fillSearchInput(searchQuery);
        //Fetch records without showing alert
        this.props.getFilteredRecords(searchQuery, true, true);
    }

    onSearchButtonClick = (e) => {
        e.preventDefault();
        //Search action resets page to 0
        this.props.changePaginationState(0, this.props.pagination.pageSize);
        this.props.deselectAllRecordRows();
        this.props.getFilteredRecords(this.props.searchField, false, false);
    }

    onClearButtonClick = (e) => {
        this.props.deselectAllRecordRows();
        this.props.getFilteredRecords("");
        this.props.searchFieldChange("");
    }

    onSearchInputChange = (e) => {
        this.props.searchFieldChange(e.target.value);
    }

    onDeleteButtonClick = (recordId) => {
        this.props.deleteRecord(recordId);
    }

    onChangePagination = (pageNumber, pageSize) => {
        this.props.changePaginationState(pageNumber, pageSize);
        this.props.getFilteredRecords(this.props.searchField);
        this.props.deselectAllRecordRows();
    }

    onToggleSelectedRow = (recordId) => (e) => {
        if (this.props.selectedRows.includes(recordId)) {
            this.props.deselectRecordRow(recordId);
        } else {
            this.props.selectRecordRow(recordId);
        }
    }

    onToggleSelectAllRows = (e) => {
        if (this.props.selectedRows.length == this.props.records.length) {
            this.props.deselectAllRecordRows();
        } else {
            this.props.selectAllRecordRows();
        }
    }

    onApproveRecordsClick = (e) => {
        this.props.approveRecords(this.props.selectedRows);
        this.props.deselectAllRecordRows();
    }

    //Order By functionality
    onColumnHeaderClick = (fieldName) => (e) => {
        let direction = 1;
        if (this.props.orderBy.ordFieldName === fieldName) {
            direction = this.props.orderBy.ordDirection * (-1);
        }
        this.props.changeOrderBy(fieldName, direction);
        this.props.getFilteredRecords(this.props.searchField, true);
    }
}

const mapStateToProps = (state) => {
    return {
        search: state.searchPage,
        records: state.searchPage.records,
        columns: state.searchPage.columns,
        searchField: state.searchPage.searchField,
        pagination: state.searchPage.pagination,
        selectedRows: state.searchPage.selected,
        orderBy: state.searchPage.orderBy
    }
}

const mapDispactchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispactchToProps)(SearchPage);