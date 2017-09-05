import React from 'react';
import RecordItem from './RecordItem';
import PanelHeader from './PanelHeader';
import ModalDialog from '../ModalDialog';
import RecordListHeader from './RecordListHeader';
import ExportDialog from '../searchPage/ExportDialog';
import RecordListControlTable from './RecordListControlTable';
import { Link } from 'react-router-dom';

//Renders recordItems, holds modal window, holds table header
class RecordList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showDeleteDialog: false,
            deleteCandidateId: null,
            showExportDialog: false,
            exportString: ""
        }

        this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    render() {
        let checkAllChecked = false;
        if (this.props.selectedRows.length || this.props.records.length) {
            checkAllChecked = (this.props.selectedRows.length == this.props.records.length);
        }

        return (
            <div className="panel panel-default">
                <PanelHeader
                    columns={this.props.columns}
                    visibleColumnToggle={this.props.visibleColumnToggle}
                    selectedRecordsCount={this.props.selectedRows.length}
                    onApproveRecordsClick={this.props.onApproveRecordsClick}
                    onExportButtonClick={this.handleExportButtonClick}
                />
                <div className="table-responsive" >

                    <RecordListControlTable
                        records={this.props.records}
                        selectedRows={this.props.selectedRows}

                        checkAllChecked={checkAllChecked}
                        onToggleSelectAllRows={this.props.onToggleSelectAllRows}
                        onDeleteButtonClick={this.toggleDeleteDialog}

                        onDeleteButtonClick={this.toggleDeleteDialog}
                        onToggleSelectedRow={this.props.onToggleSelectedRow}
                    />

                    <table className="table" style={{ position: 'relative', left: '105px' }}>
                        <thead style={{ borderTop: '2px solid #dedede' }} >
                            <RecordListHeader
                                columns={this.props.columns}
                                orderBy={this.props.orderBy}

                                onColumnHeaderClick={this.props.onColumnHeaderClick}
                            />
                        </thead>
                        <tbody>
                            {this.props.records.map((record, i) =>
                                <RecordItem key={i}
                                    record={record}
                                    columns={this.props.columns}
                                />
                            )}
                        </tbody>
                    </table>
                </div>

                {this.state.showDeleteDialog &&
                    <ModalDialog
                        onClose={this.toggleDeleteDialog}
                        onAction={this.handleDeleteButtonClick}
                        actionClass="danger"
                        actionName="Delete"
                        headerText={"Are you sure you want to delete this record?"}
                    />
                }

                {this.state.showExportDialog &&
                    <ExportDialog onClose={this.handleExportClose} textArea={this.state.exportString} />
                }
            </div >
        );
    }

    //When record's delete button get clicked - candidateId is set. On close it is cleared
    toggleDeleteDialog(id) {
        this.setState({
            showDeleteDialog: !this.state.showDeleteDialog,
            deleteCandidateId: id
        })
    }

    //Delete deleteCadidate
    handleDeleteButtonClick(recordId, e) {
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
}

export default RecordList;