import React from 'react';
import SimpleButton from '../SimpleButton';
import { Link } from 'react-router-dom';

const style = {
    heading: {
        backgroundColor: "#f5f5f5"
    },
    column: {
        margin: '10px'
    },
    row: {
        textAlign: 'center'
    },
    left: {
        display: 'inline-block',
        width: '50%'
    },
    right: {
        display: 'inline-block',
        width: '50%',
        textAlign: 'right'
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
                <div className="panel-heading" style={style.heading}
                    onClick={this.onToggleOpen}
                >
                    <div style={style.left}>
                        <p>Visible columns
                            {this.state.open && <span className="glyphicon glyphicon-menu-up" aria-hidden="true" />}
                            {!this.state.open && <span className="glyphicon glyphicon-menu-down" aria-hidden="true" />}
                        </p>
                    </div>
                    <div style={style.right}>
                        <Link to="/edit">
                            <button type="button" className="btn btn-success">New record</button>
                        </Link>
                    </div>
                </div>
                {this.state.open &&
                    <div className="panel-body">
                        <div className="row" style={style.row}>
                            {this.renderFields()}
                        </div>
                    </div>
                }
            </div>
        );
    }

    renderFields() {
        return this.props.columns.map((col, i) => (
            <label style={style.column} key={i}>
                <input type="checkbox" name={col.name}
                    checked={col.isVisible} onChange={this.onChangeCheckbox.bind(this, i)} />
                {col.name}
            </label>)
        )
    }

    onToggleOpen() {
        this.setState({
            open: !this.state.open
        })
    }

    onChangeCheckbox(index, e) {
        this.props.visibleColumnToggle(index);
    }
}

export default PanelHeader;