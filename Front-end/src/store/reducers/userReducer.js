import actionTypes from '../actions/actionTypes';

const initialState = {
    isLoggedIn: false,
    userInfo: null,
    isAdmin: false,
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                isAdmin: action.userInfo.roleId === "R1" ? true : false,
                userInfo: action.userInfo
            }
        case actionTypes.UPDATE_USER_INFO:
            return {
                ...state,
                isLoggedIn: true,
                isAdmin: action.userInfo.roleId === "R1" ? true : false,
                userInfo: action.userInfo
            }
        case actionTypes.USER_LOGIN_FAIL:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null
            }
        case actionTypes.PROCESS_LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                userInfo: null,
                isAdmin: false
            }
        default:
            return state;
    }
}

export default userReducer;