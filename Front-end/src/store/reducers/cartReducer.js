import actionTypes from '../actions/actionTypes';

const initialState = {
    listCartItem: null,
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ADD_ITEM_CART_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ADD_ITEM_CART_SUCCESS:
            return {
                ...state,
            }
        case actionTypes.FETCH_ADD_ITEM_CART_FAILED:
            return {
                ...state,
            }
        case actionTypes.FETCH_GET_ALL_ITEM_CART_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_GET_ALL_ITEM_CART_SUCCESS:
            state.listCartItem = action.dataCart;
            return {
                ...state,
            }
        case actionTypes.FETCH_GET_ALL_ITEM_CART_FAILED:
            state.listCartItem = null;
            return {
                ...state,
            }
        case actionTypes.PROCESS_LOGOUT:
            state.listCartItem = null;
            return {
                ...state,
            }

        default:
            return state;
    }
}

export default cartReducer;