import React from 'react';
import RecordItemCell from './RecordItemCell';
import SimpleButton from '../SimpleButton';

//separate into config-like file
const dictionary = [
    "DAS", "MCM", "accuracy", "comments", "cross_section",
    "cuts", "energy", "matrix_generator", "total_uncertainty",
    "process_name"
]

const RecordItem = (props) => {
    return (
        <tr>
            {renderCells(props)}
            <RecordItemCell text={<SimpleButton onClick={props.onEditClick} text="Edit" />} />
        </tr>
    )
}

function renderCells(props) {
    const items = dictionary.map(key => props[key]);

    return items.map((value, i) =>
        <RecordItemCell text={value} key={i} id={props.id}
            onEditModeActivate={props.onEditModeActivate} isInEditMode={props.isInEditMode}
            propertyName={dictionary[items.indexOf(value)]}
            //onChange=
        />
    );
}

export default RecordItem;