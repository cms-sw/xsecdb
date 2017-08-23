import React from 'react';
import { Link } from 'react-router-dom';

import { isAdmin } from '../../auth/AuthService';

const style = {
    checkbox: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'center'
    },
    actions: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'center',
        minWidth: '80px'
    },
    cell: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'right',
        minWidth: '215px',
        padding: '6px'
    },
    edit: {
        color: 'black',
        fontSize: '16px',
        padding: '3px'
    },
    delete: {
        color: '#e01414',
        fontSize: '16px',
        padding: '3px'
    }
}

const RecordItem = (props) => {
    return (
        <tr>
            {renderCells(props)}
        </tr>
    )
}

function renderCells(props) {
    //Record cells only of visible columns
    const items = props.columns.reduce((acc, col, i) => {
        if (col.isVisible) {
            acc.push(<td key={i} style={style.cell}>{props.record[col.name]}</td>);
        }
        return acc;
    }, []);

    //Checkbox for multiapprove
    const checkBoxCell = (<td key={-1} style={style.checkbox}
        onClick={props.onToggleSelectedRow(props.record['id'])}
        role="button"
    >
        <input type="checkbox" checked={props.isSelected} role="button"/>
    </td>
    );

    //Action buttons
    const buttons = (<td style={style.actions} key={-2}>
        <Link to={`edit/${props.record.id}`} style={{ marginRight: '12px' }}>
            <span className="glyphicon glyphicon-pencil" aria-hidden="true" role="button"
                style={style.edit}
            />
        </Link>
        {
            isAdmin() &&
            <span className="glyphicon glyphicon-trash" aria-hidden="true" role="button"
                onClick={props.onDeleteButtonClick} style={style.delete} />
        }
    </td>
    )

    items.unshift(checkBoxCell, buttons);
    return items;
}

// function renderButton(props) {
//     return (
//         <td style={style.cell}>
//             <Link to={`edit/${props.record.id}`} >
//                 <button type="button" className="btn btn-default">Edit</button>
//             </Link>
//             {
//                 isAdmin() &&
//                 <button type="button" className="btn btn-danger"
//                     onClick={props.onDeleteButtonClick}>Delete
//                 </button>
//             }
//         </td>
//     )
// }

export default RecordItem;