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
