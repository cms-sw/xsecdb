import React from 'react';
import RecordItem from './RecordItem';
import SimpleButton from '../SimpleButton';
import PanelHeader from './PanelHeader';
import { Link } from 'react-router-dom';

class RecordList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {
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
                        <thead style={{borderTop: '2px solid #dedede'}} >
                            <tr>
                                <th onClick={this.props.onToggleSelectAllRows}>
                                    <input type="checkbox" checked={this.props.selectedRows.length == this.props.records.length}/>
                                </th>
                                {
                                    this.props.columns.filter(col => col.isVisible == true)
                                        .map((col, i) => <th key={i}>{col.name}</th>)
                                }
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.records.map((record, i) =>
                                <RecordItem record={record} key={i}
                                    onDeleteButtonClick={this.props.onDeleteButtonClick}
                                    onToggleSelectedRow={this.props.onToggleSelectedRow}
                                    columns={this.props.columns}
                                    isSelected={this.props.selectedRows.includes(record.id)}
                                />
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default RecordList;