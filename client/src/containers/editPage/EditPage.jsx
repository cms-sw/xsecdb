import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from './actions';
import EditForm from '../../components/editPage/EditForm';


import dataFields from '../../mockData/formFields';

class EditPage extends React.Component {
    constructor(props) {
        super(props);

        this.onEditFieldChange = this.onEditFieldChange.bind(this);
        this.onSaveRecord = this.onSaveRecord.bind(this);
    }

    render() {
        return (
            <div className="container">
                <EditForm onFieldChange={this.onEditFieldChange}
                    fields={this.props.record}
                    onSaveRecord={this.onSaveRecord}
                />
            </div>
        )
    }

    componentDidMount() { 
        const recordId = this.props.match.params.recordId;
        this.props.getRecord(recordId);
    }

    onEditFieldChange(propertyName, e) {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        this.props.editFieldChange(value, propertyName);
    }

    onSaveRecord() {
        this.props.saveRecord(this.props.record);
    }

    isInsertMode() {
        return !!this.props.record.id;
    }
}

const mapStateToProps = (state) => {
    return {
        record: state.editPage
    }
}

const mapDispactchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispactchToProps)(EditPage);

