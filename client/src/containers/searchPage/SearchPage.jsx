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
    constructor(props) {
        super(props);

        this.onSearchInputChange = this.onSearchInputChange.bind(this);
        this.onSearchButtonClick = this.onSearchButtonClick.bind(this);
        this.onRecordCellChange = this.onRecordCellChange.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
    }

    render() {
        return (
            <div className="container">
                <SearchBar onSearchButtonClick={this.onSearchButtonClick} onSearchInputChange={this.onSearchInputChange} />
                <RecordList records={this.props.search.records} onRecordCellChange={this.onRecordCellChange} 
                    updateRecord={this.updateRecord}
                    addRecord={this.props.addRecord}
                    removeUnsavedRecord={this.props.removeUnsavedRecord}
                />
            </div>
        )
    }

    componentDidMount() {
        this.props.getAllRecords();
    }

    onSearchButtonClick() {
        this.props.getFilteredRecords(this.props.searchField)
    }

    onSearchInputChange(e) {
        this.props.searchFieldChange(e.target.value);
    }

    onRecordCellChange(value, recordId, propertyName) {
        this.props.recordCellChange(value, recordId, propertyName);
    }

    updateRecord(recordId) {
        const record = this.props.search.records.find(r => r.id == recordId);
        this.props.updateRecord(recordId, record);
    }

    insertRecord(recordId) {
        const record = this.props.search.records.find(r => r.id == recordId);
        this.props.insertRecords(recordId, record);
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