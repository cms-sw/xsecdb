import React from 'react';
import RecordItemCell from './RecordItemCell';

const RecordItem = (props) => {
    return (
        <div className="row">
            { renderCells(props) }
        </div>
    )
}

function renderCells(props){
    const items = [props.DAS, props.MCM, props.accuracy, props.comments, props.cross_section, props.cuts,
                    props.energy, props.matrix_generator, props.total_uncertainty, props.process_name, props.shower]
    return items.map((value, i) => <RecordItemCell text={value} key={i}/>);
}

//Naive dynamic row
function renderCellsAuto(props) {
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