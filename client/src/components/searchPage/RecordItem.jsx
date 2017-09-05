import React from 'react';
import { Link } from 'react-router-dom';

import { isAdmin } from '../../auth/AuthService';

const style = {
    cell: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'right',
        minWidth: '215px',
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
    return props.columns.reduce((acc, col, i) => {
        if (col.isVisible) {
            acc.push(<td key={i} style={style.cell}>{props.record[col.name]}</td>);
        }
        return acc;
    }, []);
}

export default RecordItem;