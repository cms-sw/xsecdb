import React from 'react';

const SimpleButton = (props) => {
    return (
        <button type="button" className="btn btn-default"
            onClick={props.onClick}
            style={props.style}
        >{props.children}</button>
    )
}

export default SimpleButton;