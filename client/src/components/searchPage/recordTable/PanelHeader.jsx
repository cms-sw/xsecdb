import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { isApproval, isUser } from '../../../auth/AuthService';

const style = {
    heading: {
        backgroundColor: "#f5f5f5"
    },
    column: {
        margin: '10px'
    },
    row: {
        textAlign: 'left'
    },
    deselect:{
        margin: '10px',
        textDecoration: 'underline',
        color: '#484747'
    },
    left: {
        display: 'inline-block',
        width: '50%'
    },
    right: {
        display: 'inline-block',
        width: '50%',
        textAlign: 'right'
    },
    export: {
        marginRight: '5px',
        backgroundColor: 'rgb(155, 156, 151)',
        color: '#fff'
    }
}

class PanelHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true
        }
    }

    render() {
        return (
            <div>
                <div className="panel-heading" style={style.heading}>
                    <div style={style.left}>
                        <p onClick={this.onToggleOpen} role="button">
                            Visible columns
                            {this.state.open && <span className="glyphicon glyphicon-menu-up" aria-hidden="true" />}
                            {!this.state.open && <span className="glyphicon glyphicon-menu-down" aria-hidden="true" />}
                        </p>
                    </div>
                    <div style={style.right}>
                        <button type="button" className="btn btn-default" style={style.export}
                            onClick={this.props.onExportButtonClick}>
                            Export <span className="glyphicon glyphicon-download-alt" aria-hidden="true" />
                        </button>
                        {
                            isApproval() &&
                            <button type="button" style={{ marginRight: '5px' }}
                                className="btn btn-primary"
                                onClick={this.props.onApproveRecordsClick}>Approve selected ({this.props.selectedRecordsCount})
                            </button>
                        }
                        {
                            isApproval() &&
                            <a className="btn btn-success" href='/edit'>
                            <button type="button" className="btn btn-success">
                                    New record
                            </button>
                            </a>
                        }
                    </div>
                </div>
                {
                    this.state.open &&
                    <div className="panel-body">
                        <div className="row" style={style.row}>
                            <button style={style.column} key={-1} role="button"
                                onClick={this.props.onDeselectAllColumns}>
                                deselect all
                            </button>
                            {this.renderColumnsSelections()}
                        </div>
                    </div>
                }
            </div>
        );
    }

    renderColumnsSelections() {
        return this.props.columns.map((col, i) => (
            <label style={style.column} key={i} role="button">
                <input type="checkbox" name={col.name}
                    checked={col.isVisible} onChange={this.onChangeCheckbox(i)} />
                {col.name}
            </label>)
        )
    }

    //Open/Close visible columns selection section
    onToggleOpen = () => {
        this.setState({
            open: !this.state.open
        })
    }
    //Change visibility of a column
    onChangeCheckbox = (index) => (e) => {
        this.props.onVisibleColumnToggle(index);
    }
}

PanelHeader.propTypes = {
    //for column checkbox rendering
    columns: PropTypes.array.isRequired,
    //for displaying how many records are selected
    selectedRecordsCount: PropTypes.number.isRequired,
    onExportButtonClick: PropTypes.func.isRequired,
    onApproveRecordsClick: PropTypes.func.isRequired,
    //callback on change column visibility
    onVisibleColumnToggle: PropTypes.func.isRequired
}

export default PanelHeader;