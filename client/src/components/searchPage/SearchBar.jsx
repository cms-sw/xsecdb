import React from 'react';

import InputField from '../InputField';
import SimpleButton from '../SimpleButton';

const SearchBar = (props) => {
    return (
        <div className="form-inline">
            <form className="inline-form">
                <InputField placeholder={"Search query..."} id="searchField"
                    style={{ width: '90%' }} onChange={props.onSearchInputChange}
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