import React from 'react';
import RecordItemCell from './RecordItemCell';

const RecordItem = (props) => {
    return (
        <tr>
            {renderCells(props)}
        </tr>
    )
}

function renderCells(props) {
    const items = [props.DAS, props.MCM, props.accuracy, props.comments, props.cross_section, props.cuts,
        props.energy, props.matrix_generator, props.total_uncertainty, props.process_name, props.shower]
    return items.map((value, i) => <RecordItemCell text={value} key={i} />);
}

export default RecordItem;