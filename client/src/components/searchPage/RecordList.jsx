import React from 'react';
import RecordItem from './RecordItem';

const header = [
    "DAS", "MCM", "accuracy", "comments", "cross_section",
    "cuts", "energy", "matrix_generator", "total_uncertainty",
    "process_name", "shower"
]

const RecordList = (props) => {
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
                    {props.records.map((record, i) => <RecordItem {...record} key={i} />)}
                </tbody>
            </table>
        </div>
    );
}

export default RecordList;