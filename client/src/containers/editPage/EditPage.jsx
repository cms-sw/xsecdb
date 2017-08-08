import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actionCreators from './actions';
import EditForm from '../../components/editPage/EditForm';
import Alert from '../../components/Alert';

class EditPage extends React.Component {
    constructor(props) {
        super(props);

        this.onEditFieldChange = this.onEditFieldChange.bind(this);
        this.onSaveRecord = this.onSaveRecord.bind(this);
    }

    render() {
        return (
            <div style={{margin: "0 2%"}}>
                <EditForm onFieldChange={this.onEditFieldChange}
                    fields={this.props.record}
                    onSaveRecord={this.onSaveRecord}
                    onCancelEdit={this.props.onCancelEdit}
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
}

const mapStateToProps = (state) => {
    return {
        record: state.editPage,
        search: state.searchPage
    }
}

const mapDispactchToProps = (dispatch) => {
    return bindActionCreators(actionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispactchToProps)(EditPage);

