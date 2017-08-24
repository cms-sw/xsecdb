import React from 'react';
import RecordItem from './RecordItem';
import PanelHeader from './PanelHeader';
import ModalDialog from '../ModalDialog';
import RecordListHeader from './RecordListHeader';
import ExportDialog from '../searchPage/ExportDialog';
import { Link } from 'react-router-dom';

import { isAdmin } from '../../auth/AuthService';

const styles = {
    checkbox: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '6px'
    },
    th: { borderRight: '1px solid #e8e8e8' },
    orderInactive: { color: '#bdb8b8' },
    edit: {
        color: 'black',
        padding: '0 3px'
    },
    delete: {
        color: '#e01414',
        padding: '0 3px'
    },
    actions: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'center',
        minWidth: '80px'
    }
}

//Renders recordItems, holds modal window, holds table header
const RecordListControlTable = (props) => {
    const rows = props.records.map((record, i) => (
        <tr key={i}>
            <td style={styles.checkbox} role="button"
                onClick={props.onToggleSelectedRow(record['id'])}
            >
                <input type="checkbox" checked={props.selectedRows.includes(record.id)}
                    role="button" />
            </td>

            <td style={styles.actions}>
                <Link to={`edit/${record.id}`} style={{ marginRight: '12px' }}>
                    <span className="glyphicon glyphicon-pencil" aria-hidden="true" role="button"
                        style={styles.edit}/>
                </Link>
                {
                    isAdmin() &&
                    <span className="glyphicon glyphicon-trash" aria-hidden="true" role="button"
                        onClick={props.onDeleteButtonClick.bind(this, record.id)} style={styles.delete} />
                }
            </td>
        </tr>
    ))

    return (
        <div style={{ position: 'absolute', backgroundColor: 'white', zIndex: 100 }}>
            <table className="table" style={{ marginBottom: 0 }}>
                <thead style={{ borderTop: '2px solid #dedede' }} >
                    <tr>
                        <th onClick={props.onToggleSelectAllRows} style={styles.checkbox} role="button">
                            <input type="checkbox" checked={props.checkAllChecked} role="button" />
                        </th>
                        <th style={styles.th}>actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

export default RecordListControlTable;