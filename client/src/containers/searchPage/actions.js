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

export const searchFieldChange = (value) => {
    return {
        type: "SEARCH_FIELD_CHANGE",
        value
    }
}

export const selectRecordRow = (recordId) => {
    return {
        type: "SELECT_RECORD_ROW",
        recordId
    }
}

export const deselectRecordRow = (recordId) => {
    return {
        type: "DESELECT_RECORD_ROW",
        recordId
    }
}

export const selectAllRecordRows = () => {
    return {
        type: "SELECT_ALL_RECORD_ROWS"
    }
}

export const deselectAllRecordRows = () => {
    return {
        type: "DESELECT_ALL_RECORD_ROWS"
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

export const changePaginationState = (currentPage, pageSize) => {
    return {
        type: "CHANGE_PAGINATION",
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize)
    }
}

export const changePagination = (currentPage, pageSize) => (dispatch, getState) => {
    dispatch(changePaginationState(currentPage, pageSize));
    const params = qs.parse(getState().router.location.search);
    dispatch(updateUrlParams(params));
}

export const visibleColumnToggle = (index) => (dispatch, getState) => {
    dispatch({
        type: "VISIBLE_COLUMNS_TOGGLE",
        index
    })
    const params = qs.parse(getState().router.location.search);
    dispatch(updateUrlParams(params));
}

const showAlert = (message, status) => {
    return {
        type: "SHOW_ALERT",
        message,
        status
    }
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
            const message = error.response.data.error_message || error.message;
            dispatch(showAlert(message, "ERROR"));
        })
}

export const deleteRecord = (recordId) => (dispatch, getState) => {
    dispatch({ type: "DELETE_RECORD_REQUEST" });

    axios.delete('delete/' + recordId)
        .then(response => {
            dispatch({
                type: "DELETE_RECORD_SUCCESS",
                recordId
            })
            dispatch(getFilteredRecords(getState().searchPage.searchField, true));
            dispatch(showAlert("Record deleted", "SUCCESS"))
        })
        .catch(error => {
            const message = error.response.data.error_message || error.message;
            dispatch(showAlert(message, "ERROR"));
        })
}

export const getInitialRecords = (query) => (dispatch, getState) => {
    dispatch({ type: "GET_ALL_RECORDS_REQUEST" });

    const request = {
        search: query,
        pagination: getState().searchPage.pagination
    }

    axios.post('search', request)
        .then(response => {
            dispatch(getRecordsSuccess(response.data));
        })
        .catch(error => {
            const message = error.response.data.error_message || error.message;
            dispatch(showAlert(message, "ERROR"));
        })
}

export const getFilteredRecords = (query, notShowAlert) => (dispatch, getState) => {
    const params = getQueryObject(query);

    dispatch({ type: "GET_FILTERED_RECORDS_REQUEST" });

    const request = {
        search: params,
        pagination: getState().searchPage.pagination
    }

    axios.post('search', request)
        .then(response => {
            dispatch(getRecordsSuccess(response.data));
            dispatch(updateUrlParams(params));

            if(!notShowAlert){
                dispatch(showAlert(`Found ${response.data.length} records`, "SUCCESS"));
            }
        })
        .catch(error => {
            const message = error.response.data.error_message || error.message;
            dispatch(showAlert(message, "ERROR"));
        })
}

export const approveRecords = (recordIds) => (dispatch, getState) => {
    dispatch({ type: "APPROVE_RECORDS_REQUEST" });

    if(recordIds.length < 1){
        dispatch(showAlert("There is no records selected", "ERROR"));
        return;
    }

    axios.post('approve', recordIds)
        .then(response => {
            dispatch(showAlert("Approved successfully", "SUCCESS"));
            dispatch({type: "DESELECT_ALL_RECORD_ROWS"})
            dispatch(getFilteredRecords(getState().searchPage.searchField, true));
        })
        .catch(error => {
            const message = error.response.data.error_message || error.message;
            dispatch(showAlert(message, "ERROR"));
        })
}

function updateUrlParams(params) {
    return (dispatch, getState) => {
        //selected visible columns
        const selection = getVisibleColumnsInt(getState().searchPage.columns);
        params[columnParameterName] = selection;

        //get pagination information
        const { pageSize, currentPage } = getState().searchPage.pagination;
        params['pageSize'] = pageSize;
        params['currentPage'] = currentPage;

        dispatch(push({
            search: qs.stringify(params)
        }))
    }
}

