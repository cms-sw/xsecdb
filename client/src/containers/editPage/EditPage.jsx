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
        //GET INPUT FIELDS FROM BACKEND
        this.props.getEditFieldsSuccess(dataFields);
        const recordId = this.props.match.params.recordId;

        //IF UPDATING RECORD
        if (recordId) {
            //GET DATA AND WIRE IT TO FIELDS 

        } else {
            //FILL FIELDS WITH DEFAULT VALUES

        }

        //ELSE 
        //(Maybe do A U B, where A is fields from backend and B is record fields)

    }

    onEditFieldChange(propertyName, e) {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

        this.props.editFieldChange(value, propertyName);
    }

    onSaveRecord() {
        const record = {};

        this.props.record.map(field => record[field.name] = field.value);
        this.props.saveRecord(record);
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

