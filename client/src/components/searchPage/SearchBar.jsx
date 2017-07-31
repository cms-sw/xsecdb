import React from 'react';

import InputField from '../InputField';
import SimpleButton from '../SimpleButton';

const style = {
    col: { paddingLeft: 0, paddingRight: 0 },
    row: { marginLeft: 0, marginRight: 0 },
    input: { width: '100%' }
}

const SearchBar = (props) => {
    return (
        <div className="form-inline">

            <form className="inline-form">
                <div className="row" style={style.row}>
                    <div className="col-sm-10" style={style.col}>
                        <input type="text" className="form-control"
                            id="searchField" placeholder="Search query..." style={style.input}
                            onChange={props.onSearchInputChange} value={props.searchFieldValue}
                        />
                    </div>
                    <div className="col-sm-1" style={style.col}>
                        <button type="submit" className="btn btn-default"
                            onClick={props.onSearchButtonClick} style={style.input}
                        >Search</button>
                    </div>
                    <div className="col-sm-1" style={style.col}>
                        <button type="button" className="btn btn-default"
                            onClick={props.onClearButtonClick} style={style.input}
                        >Clear</button>
                    </div>
                </div>
            </form>

            <div className="panel panel-default">
                <div className="panel-body">
                    <b>key=value, key=value,...</b>
                </div>
            </div>
        </div >
    )
}

export default SearchBar;