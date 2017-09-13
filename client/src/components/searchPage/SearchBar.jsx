import React from 'react';
import PropTypes from 'prop-types';

const style = {
    col: { paddingLeft: 0, paddingRight: 0 },
    row: { marginLeft: 0, marginRight: 0 },
    input: { width: '100%' },
    container: {marginBottom: '20px'}
}

const SearchBar = (props) => {
    return (
        <div className="form-inline" style={style.container}>
            <form className="inline-form">
                <div className="row" style={style.row}>
                    <div className="col-sm-10" style={style.col}>
                        <input type="text" className="form-control"
                            id="searchField" placeholder="Search query.. e.g. energy=[67]{1} && ( matrix_generator=Herw.* || createdBy=^krepecka$ )" 
                            style={style.input}
                            onChange={props.onSearchInputChange} value={props.searchFieldValue}
                        />
                    </div>
                    <div className="col-sm-1" style={style.col}>
                        <button type="submit" className="btn btn-default"
                            onClick={props.onSearchButtonClick} style={style.input}>
                            Search
                        </button>
                    </div>
                    <div className="col-sm-1" style={style.col}>
                        <button type="button" className="btn btn-default"
                            onClick={props.onClearButtonClick} style={style.input}>
                            Clear
                        </button>
                    </div>
                </div>
            </form>
        </div >
    )
}

SearchBar.propTypes = {
    //value of search value
    searchFieldValue: PropTypes.string.isRequired,
    onSearchInputChange: PropTypes.func.isRequired,
    onSearchButtonClick: PropTypes.func.isRequired,
    onClearButtonClick: PropTypes.func.isRequired
}

export default SearchBar;