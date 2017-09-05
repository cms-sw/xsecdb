
const utilsReducer = (state = {}, action) => {
    switch (action.type) {
        case "SHOW_ALERT":
            return Object.assign({}, state, {
                message: action.message,
                status: action.status,
            });
        case "ALERT_MESSEGE_RESET":
            return Object.assign({}, state, {
                message: ""
            });
        default:
            return state;
    }
}

export default utilsReducer;