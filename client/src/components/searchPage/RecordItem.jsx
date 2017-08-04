import React from 'react';
import { Link } from 'react-router-dom';

import RecordItemCell from './RecordItemCell';
import SimpleButton from '../SimpleButton';

const style = {
    checkbox: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'center'
    },
    cell: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'right',
        minWidth: '160px',
        padding: '6px'
    }

}

const RecordItem = (props) => {
    return (
        <tr>
            {renderCells(props)}
            {renderButton(props)}
        </tr>
    )
}

function renderCells(props) {
    //Record cells only of visible columns
    const items = props.columns.reduce((acc, col, i) => {
        if (col.isVisible) {
            acc.push(<td key={i} style={style.cell}>{props.record[col.name]}</td>)
        }
        return acc;
    }, []);

    const checkBoxCell = (<td key={-1} style={style.checkbox}
        onClick={props.onToggleSelectedRow.bind(this, props.record['id'])}
        role="button"
    >
        <input type="checkbox" checked={props.isSelected} />
    </td>
    );

    items.unshift(checkBoxCell)

    return items;
}

function renderButton(props) {
    return (
        <td style={style.cell}>
            <Link to={`edit/${props.record.id}`} >
                <SimpleButton>Edit</SimpleButton>
            </Link>
            <button type="button" className="btn btn-danger"
                onClick={props.onDeleteButtonClick}
            >
                Delete
            </button>
        </td>
    )
}

export default RecordItem;