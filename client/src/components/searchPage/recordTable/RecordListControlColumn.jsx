import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import RecordItem from './RecordItem';
import PanelHeader from './PanelHeader';
import ModalDialog from '../../ModalDialog';
import RecordListHeader from './RecordListHeader';
import ExportDialog from '../../searchPage/ExportDialog';

import { isAdmin } from '../../../auth/AuthService';

const styles = {
    checkbox: {
        borderRight: '1px solid #e8e8e8',
        verticalAlign: 'middle',
        textAlign: 'center',
        padding: '6px'
    },
    th: { borderRight: '1px solid #e8e8e8', minWidth: '80px' },
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

@observer
class RecordListControlColumn extends React.Component {
    render() {
        const props = this.props;
        const rows = props.records.map((record, i) => (
            <tr key={i} style={{height: props.rowHeights[i]}}>
                <td style={styles.checkbox} role="button"
                    onClick={props.onToggleSelectedRow(record['id'])}
                >
                    <input type="checkbox" checked={props.selectedRows.includes(record.id)}
                        role="button" />
                </td>

                <td style={styles.actions}>
                    <Link to={`/edit/${record.id}`} style={{ marginRight: '12px' }}>
                        <span className="glyphicon glyphicon-pencil" aria-hidden="true" role="button"
                            style={styles.edit} />
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
}

RecordListControlColumn.propTypes = {
    //for rendering Edit, Delete, determining if row is checked
    records: PropTypes.array.isRequired,
    //for determining which rows are selected
    selectedRows: PropTypes.array.isRequired,
    //for adjusting column height
    rowHeights: PropTypes.object.isRequired,
    //boolean if all rows are checked
    checkAllChecked: PropTypes.bool.isRequired,
    //callback when when row gets checked
    onToggleSelectedRow: PropTypes.func.isRequired,
    //callback when delete button clicked
    onDeleteButtonClick: PropTypes.func.isRequired,
    //callback when selected all rows gets clicked
    onToggleSelectAllRows: PropTypes.func.isRequired
}

export default RecordListControlColumn;