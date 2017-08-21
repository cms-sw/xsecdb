import { apiUrl, columnParameterName } from 'Config';
import axios from 'axios';
import { push } from 'react-router-redux';
import qs from 'query-string';

import { getQueryObject, getVisibleColumnsInt, getVisibleColumnsArray } from '../../utils/parsing';
import { getCustomHTTPError } from '../../utils/common';

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
    return searchFieldChange(query);
}

export const changePaginationState = (currentPage, pageSize) => {
    return {
        type: "CHANGE_PAGINATION",
        currentPage: parseInt(currentPage),
        pageSize: parseInt(pageSize)
    }
}

const updateUrlParams = (params) => (dispatch, getState) => {
    //selected visible columns
    const selection = getVisibleColumnsInt(getState().searchPage.columns);

    if (selection) {
        params[columnParameterName] = selection;
    }

    //get pagination information
    const { pageSize, currentPage } = getState().searchPage.pagination;
    params['pageSize'] = pageSize;
    params['currentPage'] = currentPage;

    //update browser url
    dispatch(push({
        search: qs.stringify(params)
    }))
}

//Change visible columns and update url string
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

//Get record field structure for visible columns
export const getRecordFields = (selectedColumns) => (dispatch, getState) => {
    dispatch({ type: "GET_RECORD_FIELDS_REQUEST" });

    axios.get('fields')
        .then(response => {
            //selectedColumns - decimal representation of visible columns
            const visibleColumns = getVisibleColumnsArray(selectedColumns, response.data.length);
            //map field structure to simple name: fieldName, isVisible: 
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
            const message = getCustomHTTPError(error);
            dispatch(showAlert(message, "ERROR"));
        })
}

//Delete record and show alert
export const deleteRecord = (recordId) => (dispatch, getState) => {
    dispatch({ type: "DELETE_RECORD_REQUEST" });

    axios.delete('delete/' + recordId)
        .then(response => {
            dispatch({
                type: "DELETE_RECORD_SUCCESS",
                recordId
            })
            //refresh record list
            dispatch(getFilteredRecords(getState().searchPage.searchField, true));
            dispatch(showAlert("Record deleted", "SUCCESS"))
        })
        .catch(error => {
            const message = getCustomHTTPError(error);
            dispatch(showAlert(message, "ERROR"));
        })
}

//Regular search action: gets records according to search field value and pagination
export const getFilteredRecords = (query, notShowAlert, notUpdateUrl) => (dispatch, getState) => {
    const params = getQueryObject(query);

    dispatch({ type: "GET_FILTERED_RECORDS_REQUEST" });

    const request = {
        search: params,
        pagination: getState().searchPage.pagination
    }

    axios.post('search', request)
        .then(response => {
            dispatch(getRecordsSuccess(response.data));

            if (!notUpdateUrl) {
                const searchQuery = query == '' ? { searchQuery: query } : {};
                dispatch(updateUrlParams(searchQuery));
            }

            if (!notShowAlert) {
                dispatch(showAlert(`Found ${response.data.length} records`, "SUCCESS"));
            }
        })
        .catch(error => {
            const message = getCustomHTTPError(error);
            dispatch(showAlert(message, "ERROR"));
        })
}

//Approve selected records, deselect all, refresh record list
export const approveRecords = (recordIds) => (dispatch, getState) => {
    dispatch({ type: "APPROVE_RECORDS_REQUEST" });

    if (recordIds.length < 1) {
        dispatch(showAlert("There is no records selected", "ERROR"));
        return;
    }

    axios.post('approve', recordIds)
        .then(response => {
            dispatch(showAlert("Approved successfully", "SUCCESS"));
            dispatch({ type: "DESELECT_ALL_RECORD_ROWS" })
            dispatch(getFilteredRecords(getState().searchPage.searchField, true));
        })
        .catch(error => {
            const message = getCustomHTTPError(error);
            dispatch(showAlert(message, "ERROR"));
        })
}
