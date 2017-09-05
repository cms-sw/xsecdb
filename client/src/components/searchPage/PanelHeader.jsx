import React from 'react';
import { Link } from 'react-router-dom';

import { isApproval, isUser } from '../../auth/AuthService';

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

        this.onToggleOpen = this.onToggleOpen.bind(this);
        this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
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
                            isUser() &&
                            <Link to="/edit">
                                <button type="button" className="btn btn-success">New record</button>
                            </Link>
                        }
                    </div>
                </div>
                {
                    this.state.open &&
                    <div className="panel-body">
                        <div className="row" style={style.row}>
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
                    checked={col.isVisible} onChange={this.onChangeCheckbox.bind(this, i)} />
                {col.name}
            </label>)
        )
    }

    //Open/Close visible columns selection section
    onToggleOpen() {
        this.setState({
            open: !this.state.open
        })
    }
    //Change visibility of a column
    onChangeCheckbox(index, e) {
        this.props.visibleColumnToggle(index);
    }
}

export default PanelHeader;