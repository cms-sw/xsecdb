import React from 'react';
import { Link } from 'react-router-dom';

import RecordItemCell from './RecordItemCell';
import SimpleButton from '../SimpleButton';

const RecordItem = (props) => {
    return (
        <tr>
            {renderCells(props)}
            {renderButton(props)}
        </tr>
    )
}

function renderCells(props) {
    const items = props.columns.reduce((acc, col) => {
        if(col.isVisible){
            acc.push({ value: props[col.name], key: col.name })
        }
        return acc;
    }, []);

    return items.map((item, i) =>
        <RecordItemCell key={i}>
            {item.value}
        </RecordItemCell>
    );
}

function renderButton(props) {
    return (
        <RecordItemCell>
            <Link to={`edit/${props.id}`} >
                <SimpleButton>Edit</SimpleButton>
            </Link>
            <button type="button" className="btn btn-danger"
                onClick={props.onDeleteButtonClick.bind(this, props.id)}
            >
                Delete
            </button>

        </RecordItemCell>
    )
}

export default RecordItem;