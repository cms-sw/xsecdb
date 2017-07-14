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
        this.onChange = this.onChange.bind(this);
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
                    style={this.props.style} onChange={this.onChange}
                    value={this.props.text}
                />
            )
        } else {
            return this.props.text;
        }
    }

    onChange(e){
        this.props.onRecordCellChange(e.target.value, this.props.id, this.props.propertyName)
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