import React from 'react';
import { Link } from 'react-router-dom';
import { discussionLinkColumnName as discussionColumn } from 'Config';

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
            //To render discussion column as a link
            let contents;
            if (col.name == discussionColumn) {
                contents = <a href={props.record[col.name]} target="_blank">{props.record[col.name]}</a>;
            } else {
                contents = props.record[col.name];
            }

            acc.push(<td key={i} style={style.cell}>{contents}</td>);
        }
        return acc;
    }, []);
}

export default RecordItem;