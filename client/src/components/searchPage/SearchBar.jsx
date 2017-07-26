import React from 'react';

import InputField from '../InputField';
import SimpleButton from '../SimpleButton';

const SearchBar = (props) => {
    return (
        <div className="form-inline">
            <form className="inline-form">
                {/* <InputField placeholder={} id="searchField"
                    style={} onChange={props.onSearchInputChange}
                /> */}
                <input type="text" className="form-control"
                    id="searchField" placeholder="Search query..." style={{ width: '90%' }} 
                    onChange={props.onSearchInputChange} value={props.searchFieldValue}
                />
                <div style={{ width: '10%', display: 'inline-block' }} >
                    <button type="submit" className="btn btn-default"
                        onClick={props.onSearchButtonClick}
                    >Search</button>
                </div>
            </form>

            <div className="panel panel-default">
                <div className="panel-body">
                    <b>key=value, key=value,...</b>
                </div>
            </div>
        </div>
    )
}

export default SearchBar;