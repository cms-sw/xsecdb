import React from 'react';
import RecordItemCell from './RecordItemCell';
import SimpleButton from '../SimpleButton';

//TODO: Selecting columns to show
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
        <RecordItemCell key={i}>
            {item.value}
        </RecordItemCell>
    );
}

function renderButton(props) {
    return (
        <RecordItemCell>
            <SimpleButton>
                Edit
            </SimpleButton>
        </RecordItemCell>
    )
}

export default RecordItem;