import React from 'react';
import PropTypes from 'prop-types';

const style = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1050,
    overflow: 'hidden',
    outline: 0,
    backgroundColor: 'rgba(0,0,0,0.4)'
}

const ModalDialog = (props) => {
    return (
        <div id="modalBackground" onClick={onBackgroundClick.bind(this, props.onClose)} style={style}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close"
                            onClick={props.onClose}>&times;</button>
                        <h4 className="modal-title">{props.headerText}</h4>
                    </div>
                    <div className="modal-footer">

                        <button type="button" className={"btn btn-" + props.actionClass}
                            onClick={props.onAction}>{props.actionName}</button>
                        <button type="button" className="btn btn-default"
                            onClick={props.onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

function onBackgroundClick(onClose, e) {
    if (e.target.id === "modalBackground") {
        onClose();
    }
}

ModalDialog.propTypes = {
    headerText: PropTypes.string.isRequired,
    actionClass: PropTypes.string.isRequired,
    actionName: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onAction: PropTypes.func.isRequired
}

export default ModalDialog;