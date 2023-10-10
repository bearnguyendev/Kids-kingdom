import { toast } from 'react-toastify';
import { deleteItemCartService, getAllCartByUserIdService, handleAddCartService } from '../../services/userService';
import actionTypes from './actionTypes';
export const fetchAddItemCart = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ADD_ITEM_CART_START })
            let res = await handleAddCartService(data);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ADD_ITEM_CART_SUCCESS,
                })
                dispatch(fetchAllCartByUserId(data.userId))
                toast.success(res.errMessage)
            } else {
                dispatch({
                    type: actionTypes.FETCH_ADD_ITEM_CART_FAILED
                })
                toast.error(res.errMessage)
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ADD_ITEM_CART_FAILED
            })
            console.log("FETCH_ADD_ITEM_CART_FAILED: ", error);
        }
    }
}
export const fetchAllCartByUserId = (id) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_GET_ALL_ITEM_CART_START })
            let res = await getAllCartByUserIdService(id);
            if (res && res.errCode === 0) {
                dispatch(fetchAllCartByUserIdSuccess(res.data))
            } else {
                dispatch(fetchAllCartByUserIdFailed())
            }
        } catch (error) {
            dispatch(fetchAllCartByUserIdFailed())
            console.log("FETCH_GET_ALL_ITEM_CART_FAILED: ", error);
        }
    }
}
export const fetchAllCartByUserIdSuccess = (data) => ({
    type: actionTypes.FETCH_GET_ALL_ITEM_CART_SUCCESS,
    dataCart: data
})
export const fetchAllCartByUserIdFailed = () => ({
    type: actionTypes.FETCH_GET_ALL_ITEM_CART_FAILED
})