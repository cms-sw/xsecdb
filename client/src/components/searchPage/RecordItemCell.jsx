import React from 'react';

class RecordItemCell extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            value: props.text
        }

        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    render() {
        return (
            <td onDoubleClick={this.onDoubleClick}
                onBlur={this.onBlur}
            >
                {this.renderEdit()}
            </td>
        )
    }

    renderEdit() {
        if (this.props.isInEditMode) {
            return (
                <input type="text" className="form-control"
                    style={this.props.style} onChange={this.props.onChange}
                    value={this.state.value}
                />
            )
        } else {
            return this.state.value;
        }
    }

    onDoubleClick(e) {
        this.props.onEditModeActivate(this.props.id);
    }

    onBlur() {
        this.setState({
            editing: false
        })
    }
}

export default RecordItemCell;