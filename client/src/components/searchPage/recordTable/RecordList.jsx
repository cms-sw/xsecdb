import React from 'react';
import PropTypes from 'prop-types';
import RecordItem from './RecordItem';

export default class RecordList extends React.Component {
    render() {
        return (
            <tbody>
                {this.props.records.map((record, i) =>
                    <RecordItem key={i}
                        record={record}
                        columns={this.props.columns}

                        onSize={this.props.setColumnHeight(i)}
                    />)
                }
            </tbody>
        )
    }

    //do not rerender if important information was not changed
    shouldComponentUpdate(nextProps) {
        return !(this.props.columns === nextProps.columns && this.props.records === nextProps.records);
    }
}

RecordList.propTypes = {
    //xsdb record array
    records: PropTypes.array.isRequired,
    //columns array with visibility and names
    columns: PropTypes.array.isRequired,
    //callback when the height of table row is known
    setColumnHeight: PropTypes.func.isRequired
}