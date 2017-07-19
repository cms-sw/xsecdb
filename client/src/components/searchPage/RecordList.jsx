import React from 'react';
import RecordItem from './RecordItem';
import SimpleButton from '../SimpleButton';

const header = [
    "DAS", "MCM", "accuracy", "comments", "cross_section",
    "cuts", "energy", "matrix_generator", "total_uncertainty",
    "process_name", "Edit"
]

class RecordList extends React.Component {
    render() {
        return (
            <div className="panel panel-default">

                <div className="panel-heading">Panel heading</div>
                <div className="panel-body">
                    <SimpleButton style={{backgroundColor: 'limegreen'}}
                        onClick={() => {console.log("add clicked")}}
                    >
                        <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                    </SimpleButton>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            {header.map((value, i) => <th key={i}>{value}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.records.map((record, i) =>
                            <RecordItem {...record} key={i} />
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RecordList;