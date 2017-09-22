const authReducer = (state = {}, action) => {
    switch (action.type) {
        case "GET_USER_ROLES_SUCCESS":
            return Object.assign({}, state, {
                roles: action.roles
            });
        default:
            return state;
    }
}

export default authReducer;