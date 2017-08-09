import React from 'react';
import SimpleButton from '../SimpleButton';
import DynamicField from './DynamicField';
import { isUser } from '../../auth/AuthService';


const INPUTS_IN_ROW = 4;

class EditForm extends React.Component {

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Panel heading</div>
                <div className="panel-body">
                    <form>
                        {this.renderForm()}
                    </form>
                </div>
                <div className="panel-footer">
                    {
                        isUser() &&
                        <button type="button" className="btn btn-success"
                            onClick={this.props.onSaveRecord}>Save
                        </button>
                    }
                    <button type="button" className="btn btn-warning"
                        onClick={this.props.onCancelEdit}>Cancel
                    </button>
                </div>
            </div>
        );
    }

    renderForm() {
        const fields = this.props.fields.filter(f => f.type.toLowerCase() !== "not_render");
        const n = Math.ceil(fields.length / INPUTS_IN_ROW);

        let row;
        const result = []

        for (let i = 0; i < n; i++) {
            row = (
                <div className="row" key={i}>
                    {this.renderInputs(i, fields)}
                </div>
            )
            result.push(row);
        }
        return result;
    }

    renderInputs(n, fields) {
        let index = n * INPUTS_IN_ROW;
        const count = index + INPUTS_IN_ROW > fields.length ? fields.length : index + INPUTS_IN_ROW;
        const result = [];

        for (let i = index; i < count; i++) {
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