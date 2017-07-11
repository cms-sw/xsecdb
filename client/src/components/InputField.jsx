import React from 'react';

const InputField = (props) => {
    return (
        <input type="text" className="form-control"
            id={props.id} placeholder={props.placeholder}
        />
    )
}

export default InputField;