import axios from 'axios';
import { columnParameterName } from 'Config';
import { push } from 'react-router-redux';
import { history } from '../../store';
import qs from 'query-string';

import { getQueryObject, getSearchPageUrlByParams } from '../../utils/parsing';

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

// GETS existing record OR fields only if in create mode
export const getRecord = (recordId) => (dispatch) => {
    dispatch({type: "GET_RECORD_BY_ID_REQUEST"});

    //If recordId passed - get existing, otherwise get new
    const url = !!recordId ? 'get/'+recordId : 'get';

    axios.get(url)
        .then(response => {
            const fields = [];
            //convert object into array of fields
            Object.keys(response.data).map(key => {
                fields.push({
                    name: key,
                    ...response.data[key]
                })
            })
            dispatch({
                type: "GET_RECORD_BY_ID_SUCCESS",
                fields
            });
        })
        .catch(error => {
            const message = error.response.data.error_message || error.message;
            dispatch(showAlert(message, "ERROR"));
        })
} 

export const saveRecord = (recordFields) => (dispatch, getState) => {
    dispatch({type: "SAVE_RECORD_REQUEST"});

    const record = {};
    let url;
    recordFields.map(field => record[field.name] = field.value);

    //Creating new record or editing old
    if(!record.id){
        url = 'insert';
    }else{
        url = 'update/' + record.id;
        delete record.id;
    }

    const redirectSearchUrl = getSearchPageUrlByParams(getState().searchPage, columnParameterName);

    axios.post(url, record)
        .then(response => {
            dispatch({
                type: "SAVE_RECORD_SUCCESS",
                record: response.data
            });
            dispatch(push(redirectSearchUrl));
            dispatch(showAlert(`Record saved successfully!`, "SUCCESS"));
        })
        .catch(error => {
            const message = error.response.data.error_message || error.message;
            const errorFields = error.response.data.error_fields || [];
            dispatch(showAlert(message, "ERROR"));

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
            // Fetch data again
            dispatch(getRecord(recordId));
        })
        .catch(error => {
            const message = error.response.data.error_message || error.message;
            dispatch(showAlert(message, "ERROR"));
        })
}

export const onCancelEdit = () => (dispatch, getState) =>{
    const redirectSearchUrl = getSearchPageUrlByParams(getState().searchPage, columnParameterName);
    dispatch(push(redirectSearchUrl));
}
