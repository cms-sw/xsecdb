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
                    <p>Panel Heading</p>
                </div>
                {this.state.open &&
                    <div className="panel-body">

                        <Link to="/edit">
                            <SimpleButton style={{ backgroundColor: 'limegreen' }}>
                                <span className="glyphicon glyphicon-plus" aria-hidden="true" />
                            </SimpleButton>
                        </Link>
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

    onChangeCheckbox(index, e){
        this.props.visibleColumnToggle(index);
    }
}

export default PanelHeader;