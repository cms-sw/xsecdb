
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
        case "ADD_RECORD":
            return Object.assign({}, state, {
                records: [emptyRecord, ...state.records]
            })
        case "REMOVE_UNSAVED_RECORD":
            return Object.assign({}, state, {
                records: state.records.filter(record => record.id != null)
            })
        case "GET_RECORDS_SUCCESS":
            const records = action.records.map(r => Object.assign({}, r, { id: r._id.$oid }));

            return Object.assign({}, state, { records: records });
        case "SEARCH_FIELD_CHANGE":
            return Object.assign({}, state, { searchField: action.value });
        case "RECORD_CELL_CHANGE":
            const index = getRecordIndexById(action.recordId, state.records);
            const a = Object.assign({}, state, {
                records: [
                    ...state.records.slice(0, index),
                    Object.assign({}, state.records[index], {
                        [action.propertyName]: action.value
                    }),
                    ...state.records.slice(index + 1)
                ]
            });
            console.log(a)
            return a;
        default:
            return state;
    }
}

function getRecordIndexById(id, records) {
    return records.findIndex(r => r.id == id);
}

export default searchPageReducer;