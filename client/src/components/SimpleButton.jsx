import React from 'react';

const SimpleButton = (props) => {
    return (
        <button type="button" className="btn btn-default"
            onClick={props.onClick}
        >{props.text}</button>
    )
}

export default SimpleButton;