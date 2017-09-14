import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import RecordItem from './recordTable/RecordItem';
import PanelHeader from './recordTable/PanelHeader';
import RecordListControlColumn from './recordTable/RecordListControlColumn';
import RecordList from './recordTable/RecordList';

import ModalDialog from '../ModalDialog';
import RecordListHeader from './recordTable/RecordListHeader';
import ExportDialog from '../searchPage/ExportDialog';


//Renders recordItems, holds modal window, holds table header
class RecordTableContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDeleteDialog: false,
            deleteCandidateId: null,
            showExportDialog: false,
            exportString: ""
        }
    }

    @observable columnHeights = new Array(1000);

    render() {
        let checkAllChecked = false;
        if (this.props.selectedRows.length || this.props.records.length) {
            checkAllChecked = (this.props.selectedRows.length == this.props.records.length);
        }

        return (
            <div className="panel panel-default">
                <PanelHeader
                    columns={this.props.columns}
                    selectedRecordsCount={this.props.selectedRows.length}

                    onVisibleColumnToggle={this.props.onVisibleColumnToggle}
                    onApproveRecordsClick={this.props.onApproveRecordsClick}
                    onExportButtonClick={this.handleExportButtonClick}
                    onDeselectAllColumns={this.props.onDeselectAllColumns}
                />

                <RecordListControlColumn
                        records={this.props.records}
                        selectedRows={this.props.selectedRows}
                        rowHeights={this.columnHeights}
                        checkAllChecked={checkAllChecked}

                        onToggleSelectAllRows={this.props.onToggleSelectAllRows}
                        onDeleteButtonClick={this.toggleDeleteDialog}
                        onToggleSelectedRow={this.props.onToggleSelectedRow}
                />

                <div className="table-responsive" style={{paddingLeft: '105px'}}>
                    <table className="table" >
                        <thead style={{ borderTop: '2px solid #dedede' }} >
                            <RecordListHeader
                                columns={this.props.columns}
                                orderBy={this.props.orderBy}

                                onColumnHeaderClick={this.props.onColumnHeaderClick}
                            />
                        </thead>
                        <RecordList 
                            columns={this.props.columns}
                            records={this.props.records}
                            setColumnHeight={this.setColumnHeight}
                        />
                    </table>
                </div>

                {this.state.showDeleteDialog &&
                    <ModalDialog
                        actionClass="danger"
                        actionName="Delete"
                        headerText={"Are you sure you want to delete this record?"}

                        onClose={this.toggleDeleteDialog}
                        onAction={this.handleDeleteButtonClick}
                    />
                }

                {this.state.showExportDialog &&
                    <ExportDialog onClose={this.handleExportClose} exportText={this.state.exportString} />
                }
            </div >
        );
    }

    //When record's delete button get clicked - candidateId is set. On close it is cleared
    toggleDeleteDialog = (id) => {
        this.setState({
            showDeleteDialog: !this.state.showDeleteDialog,
            deleteCandidateId: id
        })
    }

    //Delete deleteCadidate
    handleDeleteButtonClick = (recordId, e) => {
        this.toggleDeleteDialog(null);
        this.props.onDeleteButtonClick(this.state.deleteCandidateId);
    }

    handleExportButtonClick = (e) => {
        const records = this.props.records;
        const visibleColumns = this.props.columns.filter(c => c.isVisible === true);
        const result = [];
        records.map(record => {
            let res = {};

            visibleColumns.map(col => {
                res[col.name] = record[col.name];
            })
            result.push(res);
        })
        const json = JSON.stringify(result, null, 4);
        this.setState({ showExportDialog: true, exportString: json });
    }

    handleExportClose = (e) => {
        this.setState({
            showExportDialog: false,
            exportString: null
        });
    }

    setColumnHeight = (index) => (size) => {
        if (size) {
            this.columnHeights[index] = size.height
        }
    }
}

RecordTableContainer.propTypes = {
    //xsdb record array
    records: PropTypes.array.isRequired,
    //selected rows for approval
    selectedRows: PropTypes.array.isRequired,
    //columns information
    columns: PropTypes.array.isRequired,
    //ordering information to display in column header
    orderBy: PropTypes.object.isRequired,

    onApproveRecordsClick: PropTypes.func.isRequired,
    onToggleSelectedRow: PropTypes.func.isRequired,
    onToggleSelectAllRows: PropTypes.func.isRequired,
    onColumnHeaderClick: PropTypes.func.isRequired,
    onDeleteButtonClick: PropTypes.func.isRequired,
    onVisibleColumnToggle: PropTypes.func.isRequired
}


export default RecordTableContainer;