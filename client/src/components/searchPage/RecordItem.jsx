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
            {renderButton(props)}
        </tr>
    )
}

function renderCells(props) {
    const items = dictionary.map(key => ({ value: props[key], key: key }));

    return items.map((item, i) =>
        <RecordItemCell text={item.value} key={i} id={props.id}
            onEditModeActivate={props.onEditModeActivate} isInEditMode={props.isInEditMode}
            propertyName={item.key}
            onRecordCellChange={props.onRecordCellChange}
        />
    );
}

function renderButton(props) {
    if (props.isInEditMode) {
        return <RecordItemCell
            text={<SimpleButton onClick={props.onSaveButtonClick.bind(this, props.id)} text="Save" />}
        />
    } else {
        return <RecordItemCell
            text={<SimpleButton onClick={props.onEditModeActivate.bind(this, props.id)} text="Edit" />}
        />
    }
}

export default RecordItem;