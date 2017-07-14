import React from 'react';
import RecordItem from './RecordItem';
import SimpleButton from '../SimpleButton';
import InserForm from './InsertForm';

const header = [
    "DAS", "MCM", "accuracy", "comments", "cross_section",
    "cuts", "energy", "matrix_generator", "total_uncertainty",
    "process_name", "Edit"
]

class RecordList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editingRecordId: null,
            insertMode: false
        }

        this.onEditModeActivate = this.onEditModeActivate.bind(this);
        this.onSaveButtonClick = this.onSaveButtonClick.bind(this);
        this.onAddButtonClick = this.onAddButtonClick.bind(this);
    }

    render() {
        return (
            <div className="panel panel-default">

                <div className="panel-heading">Panel heading</div>
                <div className="panel-body">
                    <SimpleButton style={{backgroundColor: 'limegreen'}}
                        onClick={this.onAddButtonClick}
                    >
                        <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                    </SimpleButton>
                    <InserForm />
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
                                onSaveButtonClick={this.onSaveButtonClick}
                                onRecordCellChange={this.props.onRecordCellChange}
                            />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }

    onAddButtonClick(e){
        this.props.addRecord();
        this.setState({
            editingRecordId: null,
            insertMode: true
        })
        //remove unsaved record
    }

    onEditModeActivate(recordId) {
        //remove unsaved records
        if(this.state.insertMode){
            this.props.removeUnsavedRecord();
        }
        
        this.setState({
            editingRecordId: recordId,
            insertMode: false
        })
        //update previous record
    }

    onSaveButtonClick(recordId){
        if(this.state.insertMode){
            this.props.insertRecord();
        }else{
            this.props.updateRecord(recordId);
        }

        this.setState({
            editingRecordId: null,
            insertMode: false
        })
    }
}

export default RecordList;