import { apiUrl, columnParameterName } from 'Config';
import axios from 'axios';
import { push } from 'react-router-redux';
import qs from 'query-string';

import { getQueryObject, getVisibleColumnsInt, getVisibleColumnsArray } from '../../utils/parsing';

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';


const getRecordsSuccess = (records) => {
    return {
        type: "GET_RECORDS_SUCCESS",
        records
    }
}

const updateUrlParams = (params) => (dispatch, getState) => {
    //selected visible columns
    const selection = getVisibleColumnsInt(getState().searchPage.columns);

    params[columnParameterName] = selection;
    dispatch(push({
        search: qs.stringify(params)
    }))
}

export const searchFieldChange = (value) => {
    return {
        type: "SEARCH_FIELD_CHANGE",
        value
    }
}

export const fillSearchInput = (query) => {
    let result = "";

    Object.keys(query).map(key => {
         result += key + "=" + query[key] + ","
    })
    
    result = result.slice(0, result.length - 1);
    return searchFieldChange(result);
}

export const visibleColumnToggle = (index) => (dispatch, getState) => {
    dispatch({
        type: "VISIBLE_COLUMNS_TOGGLE",
        index
    })
    const params = qs.parse(getState().router.location.search);
    dispatch(updateUrlParams(params));
}

export const getRecordFields = (selectedColumns) => (dispatch) => {
    dispatch({ type: "GET_RECORD_FIELDS_REQUEST" });

    axios.get('fields')
        .then(response => {
            const visibleColumns = getVisibleColumnsArray(selectedColumns, response.data.length);
            const columns = response.data.map((field, i) => {
                return {
                    name: field,
                    isVisible: visibleColumns[i]
                }
            })

            dispatch({
                type: "GET_RECORD_FIELDS_SUCCESS",
                fields: columns
            })
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: "GET_RECORD_FIELDS_ERROR", error: error.message });
        })
}

export const deleteRecord = (recordId) => (dispatch) => {
    dispatch({ type: "DELETE_RECORD_REQUEST" });

    axios.delete('delete/' + recordId)
        .then(response => {
            dispatch({
                type: "DELETE_RECORD_SUCCESS",
                recordId
            })
        })
        .catch(error => {
            console.log(error);
            dispatch({ type: "DELETE_RECORD_ERROR", error: error.message });
        })
}

export const getInitialRecords = (query) => (dispatch) => {
    dispatch({ type: "GET_ALL_RECORDS_REQUEST" });

    axios.post('search', query)
        .then(response => {
            dispatch(getRecordsSuccess(response.data));
        })
        .catch(error => {
            dispatch({ type: "GET_ALL_RECORDS_ERROR", error: error.message });
        })
}

export const getFilteredRecords = (query) => (dispatch) => {
    const params = getQueryObject(query);

    dispatch({ type: "GET_FILTERED_RECORDS_REQUEST" });

    axios.post('search', params)
        .then(response => {
            dispatch(getRecordsSuccess(response.data));

            dispatch(updateUrlParams(params));
        })
        .catch(error => console.log(error))
}



