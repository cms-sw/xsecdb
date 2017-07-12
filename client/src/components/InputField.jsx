import React from 'react';

const InputField = (props) => {
    return (
        <input type="text" className="form-control"
            id={props.id} placeholder={props.placeholder}
            style={props.style} onChange={props.onChange}
        />
    )
}

export default InputField;