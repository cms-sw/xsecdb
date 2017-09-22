import store from '../store';

// MUST SAME AS IN CONFIG FILE
const ROLE_USERS = 'xsdb-users';
const ROLE_APPROVAL = 'xsdb-approval';
const ROLE_ADMINS = 'xsdb-admins';
const USER_ROLES = [ROLE_USERS, ROLE_APPROVAL, ROLE_ADMINS];

//Any of the roles
export const isUser = () => {
    return store.getState().auth.roles.some(role => USER_ROLES.includes(role));
}

//Approval or admin roles
export const isApproval = () => {
    return store.getState().auth.roles.some(role => ([ROLE_APPROVAL, ROLE_ADMINS]).includes(role));
}

//Only admin role
export const isAdmin = () => {
    return store.getState().auth.roles.some(role => role == ROLE_ADMINS);
}