import React from 'react';
import RecordItem from './RecordItem';
import SimpleButton from '../SimpleButton';
import { Link } from 'react-router-dom';

const header = [
    "DAS", "MCM", "accuracy", "comments", "cross_section",
    "cuts", "energy", "matrix_generator", "total_uncertainty",
    "process_name", "Actions"
]

class RecordList extends React.Component {
    render() {
        return (
            <div className="panel panel-default">

                <div className="panel-heading">Panel heading</div>
                <div className="panel-body">
                    <Link to="/edit">
                        <SimpleButton style={{ backgroundColor: 'limegreen' }}>
                            <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                        </SimpleButton>
                    </Link>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            {header.map((value, i) => <th key={i}>{value}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.records.map((record, i) =>
                            <RecordItem {...record} key={i} onDeleteButtonClick={this.props.onDeleteButtonClick}/>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default RecordList;