import axios from 'axios';
import { columnParameterName } from 'Config';
import { push } from 'react-router-redux';
import { history } from '../../store';
import qs from 'query-string';

import { getQueryObject, getSearchPageUrlByParams } from '../../utils/parsing';
import { getCustomHTTPError } from '../../utils/common';

export const editFieldChange = (value, propertyName) => {
    return {
        type: "EDIT_FIELD_CHANGE",
        value,
        propertyName
    }
}

export const getEditFieldsSuccess = (fields) => {
    return {
        type: "GET_EDIT_FIELDS_SUCCESS",
        fields
    }
}

const showAlert = (message, status) => {
    return {
        type: "SHOW_ALERT",
        message,
        status
    }
}

// GETS existing record OR field structure(if in create mode)
export const getRecord = (recordId) => (dispatch) => {
    dispatch({ type: "GET_RECORD_BY_ID_REQUEST" });

    //If recordId passed - get existing, otherwise get new
    const url = !!recordId ? 'get/' + recordId : 'get';

    axios.get(url)
        .then(response => {
            //Get array of dictionaries(fields)
            dispatch({
                type: "GET_RECORD_BY_ID_SUCCESS",
                fields: response.data
            });
        })
        .catch(error => {
            const message = getCustomHTTPError(error);
            dispatch(showAlert(message, "ERROR"));
        })
}

export const saveRecord = (recordFields) => (dispatch, getState) => {
    dispatch({ type: "SAVE_RECORD_REQUEST" });

    const record = {};
    let url;
    //Change fields structure to simple key:value pairs
    recordFields.map(field => record[field.name] = field.value);

    //Creating new record or editing old
    if (!record.id) {
        url = 'insert';
    } else {
        url = 'update/' + record.id;
        delete record.id;
    }
    //Url redirect to after save action
    const redirectSearchUrl = getSearchPageUrlByParams(getState().searchPage, columnParameterName);

    axios.post(url, record)
        .then(response => {
            dispatch({
                type: "SAVE_RECORD_SUCCESS",
                record: response.data
            });
            //Redirect
            dispatch(push(redirectSearchUrl));
            dispatch(showAlert(`Record saved successfully!`, "SUCCESS"));
        })
        .catch(error => {
            const message = getCustomHTTPError(error);
            dispatch(showAlert(message, "ERROR"));

            let errorFields = [];
            if (error.response) {
                errorFields = error.response.data.error_fields || [];
            }

            dispatch({
                type: 'EDIT_FIELDS_VALIDATION_ERROR',
                fieldNames: errorFields
            })
        })
}

export const approveRecord = (recordId) => (dispatch, getState) => {
    axios.post('approve', [recordId])
        .then(response => {
            dispatch(showAlert("Approved successfully", "SUCCESS"));
            // Fetch data after approve action changed some fields
            dispatch(getRecord(recordId));
        })
        .catch(error => {
            const message = getCustomHTTPError(error);
            dispatch(showAlert(message, "ERROR"));
        })
}

//Redirect to search page with selected columns and search query
export const onCancelEdit = () => (dispatch, getState) => {
    const redirectSearchUrl = getSearchPageUrlByParams(getState().searchPage, columnParameterName);
    dispatch(push(redirectSearchUrl));
}
