import React from 'react';


const DynamicField = (props) => {
    const onChange = props.onChange.bind(this, props.name);

    switch (props.type.toUpperCase()) {
        case "TEXT":
            return (
                <div className="form-group">
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <input type="text" className="form-control" name={props.name} value={props.value}
                        onChange={onChange}
                    />
                </div>
            )
        case "CHECKBOX":
            return (
                <div className="form-group" htmlFor={props.name}>
                    <label>
                        <input type="checkbox" name={props.name} checked={props.value} onChange={onChange} />
                        {props.title}
                    </label>
                </div>
            )
        case "DATE":
            return (
                <div className="form-group">
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <input type="text" className="form-control" name={props.name} value={props.value}
                        onChange={onChange} disabled
                    />
                </div>
            )
        case "NUMBER":
            return (
                <div className="form-group">
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <input type="number" className="form-control" name={props.name} value={props.value}
                        onChange={onChange}
                    />
                </div>
            )
        case "SELECT":
            return (
                <div className="form-group">
                    <label className="control-label" htmlFor={props.name}>{props.title}</label>
                    <select className="form-control selectpicker" name={props.name} value={props.value}
                        onChange={onChange}
                    >
                        {props.options.map((opt, i) => {
                            return <option key={i} value={opt}>{opt}</option>
                        })}
                    </select>
                </div>
            )
        default:
            return <div />;
    }
}

export default DynamicField;