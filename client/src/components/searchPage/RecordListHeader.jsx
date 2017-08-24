import React from 'react';

const styles = {
    left: {
        display: 'inline-block',
        width: '80%',
        textAlign: 'left'
    },
    right: {
        display: 'inline-block',
        width: '20%',
        textAlign: 'right'
    },
    th: { borderRight: '1px solid #e8e8e8' },
    orderInactive: { color: '#bdb8b8' }
}

const RecordListHeader = (props) => {
    const { ordFieldName, ordDirection } = props.orderBy;

    const header = props.columns.filter(col => col.isVisible == true)
        .map((col, i) =>
            (<th key={i} style={styles.th} onClick={props.onColumnHeaderClick(col.name)} role="button">
                <div style={styles.left}>{col.name}</div>
                <div style={styles.right}>
                    <span className="glyphicon glyphicon-triangle-top" aria-hidden="true"
                        style={col.name === ordFieldName && ordDirection === -1 ? {} : styles.orderInactive} />
                    <span className="glyphicon glyphicon-triangle-bottom" aria-hidden="true"
                        style={col.name === ordFieldName && ordDirection === 1 ? {} : styles.orderInactive} />
                </div>
            </th>)
        )

    return (
        <tr>
            { header }
        </tr>
    )
}

export default RecordListHeader;