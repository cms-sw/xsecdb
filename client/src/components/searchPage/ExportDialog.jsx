import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import fileSaver from 'file-saver';

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

class ExportDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = { textData: props.textArea }
    }

    render() {
        return (
            <div id="modalBackground" onClick={onBackgroundClick.bind(this, this.props.onClose)} style={style}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close"
                                onClick={this.props.onClose}>&times;</button>
                            <h4 className="modal-title">Export record</h4>
                        </div>
                        <div className="modal-body">
                            <textarea className="form-control" rows="15" style={{ resize: 'vertical' }}
                                onChange={this.handleTextChange} value={this.state.textData}>
                            </textarea>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" style={{ backgroundColor: '#1f5f8c' }}
                                onClick={this.saveFile}>
                                Save to file <span className="glyphicon glyphicon-save-file" aria-hidden="true" />
                            </button>
                            <CopyToClipboard text={this.state.textData}>
                                <button type="button" className="btn btn-primary" style={{ backgroundColor: '#1f5f8c' }}>
                                    Copy to clipboard <span className="glyphicon glyphicon-copy" aria-hidden="true" />
                                </button>
                            </CopyToClipboard>
                            <button type="button" className="btn btn-default" onClick={this.props.onClose}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

    handleTextChange = (e) => {
        this.setState({
            textData: e.target.value
        })
    }

    saveFile = () => {
        const blob = new Blob([this.state.textData], { type: "application/json" });
        fileSaver.saveAs(blob, "xsdb_exports.json");
    }
}


function onBackgroundClick(onClose, e) {
    if (e.target.id === "modalBackground") {
        onClose();
    }
}

export default ExportDialog;