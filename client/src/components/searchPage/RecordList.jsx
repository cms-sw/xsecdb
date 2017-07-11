import React from 'react';
import RecordItem from './RecordItem';

const RecordList = (props) => {
    return (
        <div>
            {props.records.map((record, i) => <RecordItem {...record} key={i}/>)}
        </div>
    );
}

export default RecordList;