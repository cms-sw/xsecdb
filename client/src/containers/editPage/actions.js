import axios from 'axios';
import { push } from 'react-router-redux';

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

// GETS existing record OR fields only if in create mode
export const getRecord = (recordId) => (dispatch) => {
    dispatch({type: "GET_RECORD_BY_ID_REQUEST"});

    const url = !!recordId ? 'get/'+recordId : 'get';

    axios.get(url)
        .then(response => {
            const fields = [];
            console.log(response.data)
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
            console.log(error);
            dispatch({type: "GET_RECORD_BY_ID_ERROR"});
        })
} 

export const saveRecord = (recordFields) => (dispatch) => {
    dispatch({type: "SAVE_RECORD_REQUEST"});

    const record = {};
    let url;
    recordFields.map(field => record[field.name] = field.value);

    if(!record.id){
        url = 'insert';
    }else{
        url = 'update/' + record.id;
        delete record.id;
    }

    axios.post(url, record)
        .then(response => {
            dispatch({
                type: "SAVE_RECORD_SUCCESS",
                record: response.data
            });
            dispatch(push("/"))
        })
        .catch(error => {
            console.log(error);
            dispatch({type: "SAVE_RECORD_ERROR"});
        })
}
