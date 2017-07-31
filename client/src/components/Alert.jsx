import React from 'react';
import { connect } from 'react-redux';

const style = {
    position: 'fixed',
    width: '50%',
    zIndex: 1,
    bottom: 0,
    left: '25%'
}

const className = {
    "ERROR": 'alert alert-danger alert-dismissible',
    "SUCCESS": 'alert alert-success alert-dismissible',
}

class Alert extends React.Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps != this.props && nextProps.errorMessage != '') {
            setTimeout(this.handleClose, this.props.autoCloseTime);
        }
    }

    render() {
        if (this.props.message != '') {
            return (
                <div className={className[this.props.status]}
                    role="alert" style={style}
                >
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                        onClick={this.handleClose}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>{this.props.message}</strong>
                </div>
            )
        } else {
            return null;
        }
    }

    handleClose() {
        this.props.dispatch({
            type: "ALERT_MESSEGE_RESET"
        })
    }
}

const mapStateToProps = (state) => {
    return {
        message: state.utils.message,
        status: state.utils.status
    }
}

export default connect(mapStateToProps, null)(Alert);