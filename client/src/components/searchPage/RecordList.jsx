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
                />
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                {
                                    this.props.columns.filter(col => col.isVisible == true)
                                        .map((col, i) => <th key={i}>{col.name}</th>)
                                }
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.records.map((record, i) =>
                                <RecordItem {...record} key={i}
                                    onDeleteButtonClick={this.props.onDeleteButtonClick}
                                    columns={this.props.columns}
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