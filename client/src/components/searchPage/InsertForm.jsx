import React from 'react';
import SimpleButton from '../SimpleButton'

const INPUTS_IN_ROW = 4;

const emptyRecord = {
    id: null,
    DAS: "",
    MCM: "",
    accuracy: "",
    comments: "",
    contact: "",
    cross_section: "",
    cuts: "",
    energy: "",
    equivalent_lumi: "",
    fraction_negative_weight: "",
    isValid: "",
    kFactor: "",
    matrix_generator: "",
    other_uncertainty: "",
    process_name: "",
    refs: "",
    reweighting: "",
    shower: "",
    total_uncertainty: "",
    validFrom: "",
    validTo: ""
}

class InsertForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.renderForm()}
                <SimpleButton>Add</SimpleButton>
            </div>
        );
    }


    renderForm() {
        const keys = Object.keys(emptyRecord);
        const n = Math.ceil(keys.length / INPUTS_IN_ROW);

        let row;
        const result = []

        for (let i = 0; i < n; i++) {
            row = (<div className="row">

                {this.renderInputs(i, keys)}

            </div>)
            result.push(row);
        }
        return result;
    }

    renderInputs(n, keys) {
        let index = n * INPUTS_IN_ROW;
        const count = index + INPUTS_IN_ROW > keys.length ? keys.length : index + INPUTS_IN_ROW;

        const result = [];

        for (let i = index; i < count; i++) {
            result.push((
                <div className="col-lg-3 col-sm-6">
                    <label for="basic-url">{(Object.keys(emptyRecord))[i]}</label>
                    <div className="input-group" style={{width: '100%'}}>
                        {/*<span class="input-group-addon" id="sizing-addon1">{(Object.keys(emptyRecord))[i]}</span>*/}
                        <input type="text" className="form-control" placeholder="Search for..." />
                    </div>
                </div>
            ))
        }
        return result;
    }

}

export default InsertForm;