import React from 'react';
import RecordItem from './RecordItem';
import PanelHeader from './PanelHeader';
import ModalDialog from '../ModalDialog';
import { Link } from 'react-router-dom';

const styles = {
    th: {
        borderRight: '1px solid #e8e8e8'
    },
    checkbox: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'center'
    }
}

//Renders recordItems, holds modal window, holds table header
class RecordList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            deleteCandidateId: null
        }
        this.toggleDeleteDialog = this.toggleDeleteDialog.bind(this);
        this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    }

    render() {
        let checkAllChecked = false;
        if(this.props.selectedRows.length || this.props.records.length){
            checkAllChecked = (this.props.selectedRows.length == this.props.records.length);
        }

        return (
            <div className="panel panel-default">
                <PanelHeader
                    columns={this.props.columns}
                    visibleColumnToggle={this.props.visibleColumnToggle}
                    selectedRecordsCount={this.props.selectedRows.length}
                    onApproveRecordsClick={this.props.onApproveRecordsClick}
                />
                <div className="table-responsive">
                    <table className="table">
                        <thead style={{ borderTop: '2px solid #dedede' }} >
                            <tr>
                                <th onClick={this.props.onToggleSelectAllRows} style={styles.checkbox}>
                                    <input type="checkbox" checked={checkAllChecked} />
                                </th>
                                {
                                    this.props.columns.filter(col => col.isVisible == true)
                                        .map((col, i) => <th key={i} style={styles.th}>{col.name}</th>)
                                }
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.records.map((record, i) =>
                                <RecordItem record={record} key={i}
                                    onDeleteButtonClick={this.toggleDeleteDialog.bind(this, record.id)}
                                    onToggleSelectedRow={this.props.onToggleSelectedRow}
                                    columns={this.props.columns}
                                    isSelected={this.props.selectedRows.includes(record.id)}
                                />
                            )}
                        </tbody>
                    </table>
                </div>

                {this.state.dialogOpen &&
                    <ModalDialog
                        onClose={this.toggleDeleteDialog}
                        onAction={this.handleDeleteButtonClick}
                        actionClass="danger"
                        actionName="Delete"
                        headerText={"Are you sure you want to delete this record?"}
                    />
                }
            </div>
        );
    }

    //When record's delete button get clicked - candidateId is set. On close it is cleared
    toggleDeleteDialog(id) {
        this.setState({
            dialogOpen: !this.state.dialogOpen,
            deleteCandidateId: id
        })
    }

    //Delete deleteCadidate
    handleDeleteButtonClick(recordId, e) {
        this.toggleDeleteDialog(null);
        this.props.onDeleteButtonClick(this.state.deleteCandidateId);
    }
}

export default RecordList;