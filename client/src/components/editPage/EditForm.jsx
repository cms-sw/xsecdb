import React from 'react';
import DynamicField from './DynamicField';
import { isUser, isApproval } from '../../auth/AuthService';

const style = {
    left: {
        display: 'inline-block',
        width: '50%'
    },
    right: {
        display: 'inline-block',
        width: '50%',
        textAlign: 'right'
    }
}

const INPUTS_IN_ROW = 4;

// Dynamic - Responsive bootstrap form
class EditForm extends React.Component {
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h4>{this.props.isNew ? "Create a record" : "Edit a record"}</h4>
                </div>
                <div className="panel-body">
                    <form>
                        {this.renderForm()}
                    </form>
                </div>
                <div className="panel-footer">
                    <div style={style.left}>
                        {
                            isUser() &&
                            <button type="button" className="btn btn-success"
                                onClick={this.props.onSaveRecord}>Save
                            </button>
                        }
                        <button type="button" className="btn btn-default" style={{marginLeft: '5px'}}
                            onClick={this.props.onCancelEdit}>Cancel
                        </button>
                    </div>
                    <div style={style.right}>
                        {
                            isApproval() &&
                            <button type="button" className="btn btn-primary" disabled={this.props.isNew}
                                onClick={this.props.onApproveRecord}>Approve
                            </button>
                        }
                    </div>
                </div>
            </div>
        );
    }

    //renders dynamic responsive form
    renderForm() {
        //Fields that should not be rendered have type "not_render" (for example id field)
        const fields = this.props.fields.filter(f => f.type.toLowerCase() !== "not_render");
        //Number of rows
        const n = Math.ceil(fields.length / INPUTS_IN_ROW);
        let row;
        const result = []

        for (let i = 0; i < n; i++) {
            row = (
                <div className="row" key={i}>
                    {this.renderFormRow(i, fields)}
                </div>
            )
            result.push(row);
        }
        return result;
    }

    //Renders form row
    renderFormRow(rowNumber, fields) {
        let startIndex = rowNumber * INPUTS_IN_ROW;
        const endIndex = startIndex + INPUTS_IN_ROW > fields.length ? fields.length : startIndex + INPUTS_IN_ROW;
        const result = [];

        //Fields from range [start index:endIndex]
        for (let i = startIndex; i < endIndex; i++) {
            result.push((
                <div className="col-lg-3 col-sm-6" key={i}>
                    <DynamicField key={i} {...fields[i]} onChange={this.props.onFieldChange} />
                </div>
            ))
        }
        return result;
    }
}

export default EditForm;