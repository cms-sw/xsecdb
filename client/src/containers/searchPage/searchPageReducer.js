const searchPageReducer = (state = [], action) => {
    switch (action.type) {
        case "GET_RECORDS_SUCCESS":
            const records = action.records.map(r => Object.assign({}, r, { id: r._id.$oid }));
            return Object.assign({}, state, { records: records });
        case "SEARCH_FIELD_CHANGE":
            return Object.assign({}, state, { searchField: action.value });
        case "VISIBLE_COLUMNS_TOGGLE":
            const i = action.index;
            return Object.assign({}, state, {
                columns: [
                    ...state.columns.slice(0, i),
                    Object.assign({}, state.columns[i], { isVisible: !state.columns[i].isVisible }),
                    ...state.columns.slice(i + 1)
                ]
            });
        case "VISIBLE_COLUMNS_DESELECT":
            const new_columns = state.columns.slice(0);
            new_columns.map(col => col.isVisible = 0);
            new_columns[0].isVisible = true; 
            
            return Object.assign({}, state, {columns: new_columns});
        case "GET_RECORD_FIELDS_SUCCESS":
            return Object.assign({}, state, { columns: action.fields });
        case "DELETE_RECORD_SUCCESS":
            return Object.assign({}, state, {
                records: state.records.filter(record => record.id != action.recordId)
            });
        case "SELECT_RECORD_ROW":
            return Object.assign({}, state, {
                selected: [...state.selected, action.recordId]
            });
        case "DESELECT_RECORD_ROW":
            return Object.assign({}, state, {
                selected: state.selected.filter(id => id != action.recordId)
            });
        case "SELECT_ALL_RECORD_ROWS":
            return Object.assign({}, state, {
                selected: state.records.map(r => r.id)
            });
        case "DESELECT_ALL_RECORD_ROWS":
            return Object.assign({}, state, {
                selected: []
            });
        case "CHANGE_PAGINATION":
            return Object.assign({}, state, {
                pagination: {
                    pageSize: action.pageSize,
                    currentPage: action.currentPage
                }
            });
        case "CHANGE_ORDER_BY":
            return Object.assign({}, state, {
                orderBy: {
                    ordFieldName: action.fieldName,
                    ordDirection: parseInt(action.direction)
                }
            });
        default:
            return state;
    }
}

function getRecordIndexById(id, records) {
    return records.findIndex(r => r.id == id);
}

export default searchPageReducer;