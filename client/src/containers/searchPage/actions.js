import { apiUrl } from 'Config';
import axios from 'axios';
import { push } from 'react-router-redux';
import qs from 'query-string';

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';



const getRecordsSuccess = (records) => {
    return {
        type: "GET_RECORDS_SUCCESS",
        records
    }
}

const updateUrlParams = (params) => (dispatch, getStore) => {
    console.log(getStore().searchPage)
    const selection = getStore().searchPage.columns.map(c => c.isVisible | 0);
    console.log(selection);

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

export const visibleColumnToggle = (index) => {
    return {
        type: "VISIBLE_COLUMNS_TOGGLE",
        index
    }
}

export const getRecordFields = () => (dispatch) => {
    dispatch({ type: "GET_RECORD_FIELDS_REQUEST" });

    axios.get('fields')
        .then(response => {
            const columns = response.data.map(field => {
                return {
                    name: field,
                    isVisible: true
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




function getQueryObject(query = "") {
    const _and = ",", _or = "|", _assing = "=";

    query = query.replace(/\s/g, "");

    const pairs = query.split(_and);
    const conditions = {};

    pairs.map(pair => {
        const pp = pair.split(_assing);
        conditions[pp[0]] = pp[1];
    })

    return conditions;
}