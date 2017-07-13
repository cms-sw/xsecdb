import React from 'react';
import RecordItem from './RecordItem';

const header = [
    "DAS", "MCM", "accuracy", "comments", "cross_section",
    "cuts", "energy", "matrix_generator", "total_uncertainty",
    "process_name", "Edit"
]

class RecordList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editingRecordId: null
        }

        this.onEditModeActivate = this.onEditModeActivate.bind(this);
    }

    render() {
        return (
            <div className="panel panel-default">

                <div className="panel-heading">Panel heading</div>
                <div className="panel-body">
                    <p>...</p>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            {header.map((value, i) => <th key={i}>{value}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.records.map((record, i) =>
                            <RecordItem {...record} key={i} 
                                isInEditMode={this.state.editingRecordId == record.id}
                                onEditModeActivate={this.onEditModeActivate}
                            />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    onEditModeActivate(recordId) {
        this.setState({
            editingRecordId: recordId
        })

        //update previous record
    }
}

export default RecordList;