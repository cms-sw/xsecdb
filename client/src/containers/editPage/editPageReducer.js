const editPageReducer = (state = {}, action) => {
    switch (action.type) {
        case "EDIT_FIELD_CHANGE":
            const index = state.findIndex(field => field.name == action.propertyName);

            return [
                ...state.slice(0, index),
                Object.assign({}, state[index], {
                    value: action.value
                }),
                ...state.slice(index + 1)
            ];
        case "GET_EDIT_FIELDS_SUCCESS":
            return action.fields
        case "GET_RECORD_BY_ID_SUCCESS":
            return action.fields;
        case "EDIT_FIELDS_VALIDATION_ERROR":
            const errorFields = action.errorFields;

            // Add/clear errors
            return state.map(field => {
                if (errorFields[field.name]) {
                    return {
                        ...field,
                        errorMessage: errorFields[field.name]
                    }
                } else {
                    return {
                        ...field,
                        errorMessage: ""
                    }
                }
            })
        default:
            return state;
    }
}

export default editPageReducer;