import store from '../store';

// MUST SAME AS IN CONFIG FILE
const ROLE_ADMINS = 'xsdb-admins';
const ROLE_USERS = 'xsdb-users';
const ROLE_APPROVAL = 'xsdb-approval';

export const isAdmin = () => {
    return store.getState().auth.roles.includes(ROLE_ADMINS);
}

export const isUser = () => {
    return store.getState().auth.roles.includes(ROLE_USERS);
}

export const isApproval = () => {
    return store.getState().auth.roles.includes(ROLE_APPROVAL);
}