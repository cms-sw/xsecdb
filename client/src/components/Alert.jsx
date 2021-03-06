import React from 'react';
import PropTypes from 'prop-types';
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
    constructor() {
        super();

        //to keep showing latest alert for required period of time
        this.state = {
            queue: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props && nextProps.message) {
            setTimeout(this.handleClose, this.props.autoCloseTime);
            //push to queue - means we will wait longer before closing alert
            this.state.queue.push(1);
        }
    }

    render() {
        if (this.props.message != '') {
            return (
                <div className={className[this.props.status]}
                    role="alert" style={style}
                >
                    <button type="button" className="close" aria-label="Close" onClick={this.handleClose} >
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <strong>{this.props.message}</strong>
                </div>
            )
        } else {
            return null;
        }
    }

    handleClose = () => {
        //Remove item from queue
        this.state.queue.pop();

        if (this.state.queue.length == 0) {
            this.props.dispatch({
                type: "ALERT_MESSEGE_RESET"
            })
        }
    }
}

Alert.propTypes = {
    //message text
    message: PropTypes.string,
    //status: error or success
    status: PropTypes.string,
    //Time after which notification automatically closes
    autoCloseTime: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
    return {
        message: state.utils.message,
        status: state.utils.status,
    }
}

export default connect(mapStateToProps, null)(Alert);