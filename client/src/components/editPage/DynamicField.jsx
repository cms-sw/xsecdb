import React from 'react';

// Returns HTML component according to field type
const DynamicField = (props) => {
    const onChange = props.onChange.bind(this, props.name);
    const hasError = !!props.errorMessage;

    switch (props.type.toUpperCase()) {
        case "TEXT":
            return (
                <div className={hasError ? "form-group has-error" : "form-group"}>
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <input type="text" className="form-control" name={props.name} value={props.value}
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
                        <input type="checkbox" name={props.name} checked={props.value} onChange={onChange}
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
                    <input type="text" className="form-control" name={props.name} value={props.value}
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
                    <input type="number" className="form-control" name={props.name} value={props.value}
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
                    <select className="form-control selectpicker" name={props.name} value={props.value}
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
        default:
            return <div />;
    }
}

export default DynamicField;