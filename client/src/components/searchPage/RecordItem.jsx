import React from 'react';
import RecordItemCell from './RecordItemCell';

const RecordItem = (props) => {
    console.log("sss")
    return (
        <div className="row">
            { renderCells(props) }
        </div>
    )
}

function renderCells(props) {
    let index = 0, result = [];

    for (const prop in props) {
        if(props.hasOwnProperty(prop)){
            result.push(<RecordItemCell text={props[prop]} key={index}/>);
        }
        index++;
    }

    return result;
}

export default RecordItem;