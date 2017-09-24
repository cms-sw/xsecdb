import React from 'react';
import PropTypes from 'prop-types';

// Returns HTML component according to field type
const DynamicField = (props) => {
    const onChange = props.onChange.bind(this, props.name);
    const hasError = !!props.errorMessage;

    switch (props.type.toUpperCase()) {
        case "TEXT":
            return (
                <div className={hasError ? "form-group has-error" : "form-group"}>
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <input type="text" className="form-control" name={props.name} value={props.value || ""}
                        onChange={onChange} disabled={props.disabled}
                    />
                    {
                        hasError && <span className="help-block">{props.errorMessage}</span>
                    }
                </div>
            )
        case "CHECKBOX":
            return (
                <div className={hasError ? "form-group has-error" : "form-group"}>
                    <label>
                        <input type="checkbox" name={props.name} checked={props.value || false} onChange={onChange}
                            disabled={props.disabled} />
                        {props.title}
                    </label>
                    {
                        hasError && <span className="help-block">{props.errorMessage}</span>
                    }
                </div>
            )
        case "DATE":
            return (
                <div className={hasError ? "form-group has-error" : "form-group"}>
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <input type="text" className="form-control" name={props.name} value={props.value || ""}
                        onChange={onChange} disabled={props.disabled}
                    />
                    {
                        hasError && <span className="help-block">{props.errorMessage}</span>
                    }
                </div>
            )
        case "NUMBER":
            return (
                <div className={hasError ? "form-group has-error" : "form-group"}>
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <input type="number" className="form-control" name={props.name} value={props.value || 0}
                        onChange={onChange} disabled={props.disabled}
                    />
                    {
                        hasError && <span className="help-block">{props.errorMessage}</span>
                    }
                </div>
            )
        case "SELECT":
            return (
                <div className={hasError ? "form-group has-error" : "form-group"}>
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <select className="form-control selectpicker" name={props.name} value={props.value || ""}
                        onChange={onChange} disabled={props.disabled}
                    >
                        {props.options.map((opt, i) => {
                            return <option key={i} value={opt}>{opt}</option>
                        })}
                    </select>
                    {
                        hasError && <span className="help-block">{props.errorMessage}</span>
                    }
                </div>
            )
        case "HREF":
            return (
                <div className={hasError ? "form-group has-error" : "form-group"}>
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>

                    <div className="input-group">
                        <input type="text" className="form-control" name={props.name} value={props.value || ""}
                            onChange={onChange} disabled={props.disabled}
                        />
                        <span className="input-group-addon">
                            <a href={props.value || ""} target="_blank">
                                <span className="glyphicon glyphicon-new-window" aria-hidden="true"></span>
                            </a>
                        </span>
                    </div>

                    {
                        hasError && <span className="help-block">{props.errorMessage}</span>
                    }
                </div>
            )
        default:
            return <div />;
    }
}

DynamicField.propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.array
}

export default DynamicField;