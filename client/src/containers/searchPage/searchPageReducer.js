
const searchPageReducer = (state = [], action) => {
    console.log(action);
    switch (action.type) {
        case "GET_RECORDS_SUCCESS":
            return Object.assign({}, state, { records: action.records });
        case "SEARCH_FIELD_CHANGE":
            return Object.assign({}, state, { searchField: action.value });
        default:
            return state;
    }
}

export default searchPageReducer;