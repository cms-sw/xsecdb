
//external - config file (?)
const emptyRecord = {
    id: null,
    DAS: "",
    MCM: "",
    accuracy: "",
    comments: "",
    contact: "",
    cross_section: "",
    cuts: "",
    energy: "",
    equivalent_lumi: "",
    fraction_negative_weight: "",
    isValid: "",
    kFactor: "",
    matrix_generator: "",
    other_uncertainty: "",
    process_name: "",
    refs: "",
    reweighting: "",
    shower: "",
    total_uncertainty: "",
    validFrom: "",
    validTo: ""
}

const searchPageReducer = (state = [], action) => {
    console.log(action);
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
        case "GET_RECORD_FIELDS_SUCCESS":
            return Object.assign({}, state, { columns: action.fields });
        case "DELETE_RECORD_SUCCESS":
            return Object.assign({}, state, {
                records: state.records.filter(record => record.id != action.recordId)
            });
        default:
            return state;
    }
}

function getRecordIndexById(id, records) {
    return records.findIndex(r => r.id == id);
}

export default searchPageReducer;