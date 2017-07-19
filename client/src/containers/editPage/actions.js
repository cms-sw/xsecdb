import axios from 'axios';

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

export const getRecordById = (recordId) => (dispatch) => {
    dispatch({type: "GET_RECORD_BY_ID_REQUEST"});

    axios.get('insert', record)
        .then(response => {
            dispatch({
                type: "SAVE_RECORD_SUCCESS",
                record: response.data
            });
        })
        .catch(error => {
            console.log(error);
            dispatch({type: "SAVE_RECORD_ERROR"});
        })
} 

export const saveRecord = (record) => (dispatch) => {
    dispatch({type: "SAVE_RECORD_REQUEST"});

    axios.post('insert', record)
        .then(response => {
            dispatch({
                type: "SAVE_RECORD_SUCCESS",
                record: response.data
            });
        })
        .catch(error => {
            console.log(error);
            dispatch({type: "SAVE_RECORD_ERROR"});
        })
}
