import actionTypes from './actionTypes';
import { getAllCodeService, createANewUser, deleteUserService, editUserService, getAllUsers, getAllProducts, deleteProductService, getAllProductImageFromProductService, getAllBanners, getAllTypeShips, getAllBlogs, getAllTypeVouchers, getAllVouchers, getTopProductHomePage, getListBanners, getListBlogs, getAllReceiverByUserIdService, getAllVoucherByUserId, getDetailUserById, getAllOrderByUserIdService, getAllOrderService, getDetailOrderByIdService, getAllCommentByProductIdService, getAllImports } from "../../services/userService";
import { toast } from 'react-toastify'
import { FormattedMessage } from 'react-intl';
export const fetchAllcodeGenders = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_GENDER_START })
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_GENDER_SUCCESS,
                    dataGender: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_GENDER_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_GENDER_FAILED
            })
            console.log("FETCH_ALLCODE_GENDER_FAILED: ", error);
        }
    }
}
export const fetchAllcodeRoles = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_ROLE_START })
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_ROLE_SUCCESS,
                    dataRole: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_ROLE_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_ROLE_FAILED
            })
            console.log("FETCH_ALLCODE_ROLE_FAILED: ", error);
        }
    }
}
export const fetchAllcodeCategory = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_CATEGORY_START })
            let res = await getAllCodeService("CATEGORY");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_CATEGORY_SUCCESS,
                    dataCategory: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_CATEGORY_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_CATEGORY_FAILED
            })
            console.log("FETCH_ALLCODE_CATEGORY_FAILED: ", error);
        }
    }
}
export const fetchAllcodeBrands = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_BRAND_START })
            let res = await getAllCodeService("BRAND");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_BRAND_SUCCESS,
                    dataBrand: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_BRAND_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_BRAND_FAILED
            })
            console.log("FETCH_ALLCODE_BRAND_FAILED: ", error);
        }
    }
}
export const fetchAllcodeWarranties = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_WARRANTY_START })
            let res = await getAllCodeService("WARRANTY");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_WARRANTY_SUCCESS,
                    dataWarranty: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_WARRANTY_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_WARRANTY_FAILED
            })
            console.log("FETCH_ALLCODE_WARRANTY_FAILED: ", error);
        }
    }
}
export const fetchAllcodeSubjects = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_SUBJECT_START })
            let res = await getAllCodeService("SUBJECT");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SUBJECT_SUCCESS,
                    dataSubject: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_SUBJECT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_SUBJECT_FAILED
            })
            console.log("FETCH_ALLCODE_SUBJECT_FAILED: ", error);
        }
    }
}
export const fetchAllcodeDiscounts = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_DISCOUNT_START })
            let res = await getAllCodeService("DISCOUNT");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_DISCOUNT_SUCCESS,
                    dataDiscount: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_DISCOUNT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_DISCOUNT_FAILED
            })
            console.log("FETCH_ALLCODE_DISCOUNT_FAILED: ", error);
        }
    }
}
export const fetchAllcodeAgeUseProduct = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_AGE_USE_PRODUCT_START })
            let res = await getAllCodeService("AGE-USE-PRODUCT");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_AGE_USE_PRODUCT_SUCCESS,
                    dataAgeUseProduct: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_AGE_USE_PRODUCT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_AGE_USE_PRODUCT_FAILED
            })
            console.log("FETCH_ALLCODE_AGE_USE_PRODUCT_FAILED: ", error);
        }
    }
}
export const fetchAllcodeStatusOrder = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALLCODE_STATUS_ORDER_START })
            let res = await getAllCodeService("STATUS-ORDER");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_STATUS_ORDER_SUCCESS,
                    dataStatusOrder: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALLCODE_STATUS_ORDER_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALLCODE_STATUS_ORDER_FAILED
            })
            console.log("FETCH_ALLCODE_STATUS_ORDER_FAILED: ", error);
        }
    }
}
export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.CREATE_USER_START })
            let res = await createANewUser(data);
            if (res && res.errCode === 0) {
                dispatch(saveUserSuccess())
                toast.success(res.errMessage)
                dispatch(fetchAllUserStart())
            } else {
                toast.error(res.errMessage)
                dispatch(saveUserFailed())
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
            dispatch(saveUserFailed())
            console.log("saveUserFailed error: ", error);
        }
    }
}
export const saveUserSuccess = () => ({
    type: actionTypes.CREATE_USER_SUCCESS
})
export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED
})

export const fetchAllUserStart = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_USER_START })
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                dispatch(fetchAllUserSuccess(res.data))
            } else {
                toast.error("Fetch all user error!")
                dispatch(fetchAllUserFailed())
            }
        } catch (error) {
            toast.error("Fetch all user error!")
            dispatch(fetchAllUserFailed())
            console.log("fetchAllUserFailed error: ", error);
        }
    }
}
export const fetchAllUserSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USER_SUCCESS,
    users: data
})
export const fetchAllUserFailed = () => ({
    type: actionTypes.FETCH_ALL_USER_FAILED
})

export const deleteAUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.DELETE_USER_START })
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                dispatch(deleteUserSuccess())
                toast.success(res.errMessage)
                dispatch(fetchAllUserStart())
            } else {
                toast.error(res.errMessage)
                dispatch(deleteUserFailed())
            }
        } catch (error) {
            toast.error("Delete a user error!")
            dispatch(deleteUserFailed())
            console.log("deleteUserFailed error: ", error);
        }
    }
}
export const deleteUserSuccess = () => ({
    type: actionTypes.DELETE_USER_SUCCESS
})
export const deleteUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED
})

export const editAUser = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.EDIT_USER_START })
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                dispatch(editUserSuccess())
                toast.success(res.errMessage)
                dispatch(fetchAllUserStart())
            } else {
                toast.error(res.errMessage)
                dispatch(editUserFailed())
            }
        } catch (error) {
            toast.error("Update a user error!")
            dispatch(editUserFailed())
            console.log("editUserFailed error: ", error);
        }
    }
}
export const editUserSuccess = () => ({
    type: actionTypes.EDIT_USER_SUCCESS
})
export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED
})
export const fetchDetailUserById = (id) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_DETAIL_USER_BY_ID_START })
            let res = await getDetailUserById(id);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_USER_BY_ID_SUCCESS,
                    dataAUser: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_DETAIL_USER_BY_ID_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_DETAIL_USER_BY_ID_FAILED
            })
            console.log("FETCH_DETAIL_USER_BY_ID_FAILED: ", error);
        }
    }
}

export const fetchAllProducts = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_PRODUCT_START })
            let res = await getAllProducts(data);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_PRODUCT_SUCCESS,
                    dataProduct: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_PRODUCT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_PRODUCT_FAILED
            })
            console.log("FETCH_ALL_PRODUCT_FAILED: ", error);
        }
    }
}
export const fetchTopProducts = (limit) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_TOP_PRODUCT_START })
            let res = await getTopProductHomePage(limit, "view");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TOP_PRODUCT_SUCCESS,
                    dataTopProduct: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_TOP_PRODUCT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_TOP_PRODUCT_FAILED
            })
            console.log("FETCH_TOP_PRODUCT_FAILED: ", error);
        }
    }
}
export const fetchNewProducts = (limit) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_NEW_PRODUCT_START })
            let res = await getTopProductHomePage(limit, "createdAt");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_NEW_PRODUCT_SUCCESS,
                    dataNewProduct: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_NEW_PRODUCT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_NEW_PRODUCT_FAILED
            })
            console.log("FETCH_NEW_PRODUCT_FAILED: ", error);
        }
    }
}
export const deleteAProduct = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.DELETE_PRODUCT_START })
            let res = await deleteProductService(data);
            if (res && res.errCode === 0) {
                dispatch(deleteProductSuccess())
                toast.success(res.errMessage)
                dispatch(fetchAllProducts({
                    statusId: "ALL",
                    categoryId: "ALL",
                    brandId: "ALL",
                    valueSearch: "ALL"
                }))
            } else {
                toast.error(res.errMessage)
                dispatch(deleteProductFailed())
            }
        } catch (error) {
            toast.error("Xoá sản phẩm thất bại!")
            dispatch(deleteProductFailed())
            console.log("deleteProductFailed error: ", error);
        }
    }
}
export const deleteProductSuccess = () => ({
    type: actionTypes.DELETE_PRODUCT_SUCCESS
})
export const deleteProductFailed = () => ({
    type: actionTypes.DELETE_PRODUCT_FAILED
})
export const fetchAllProductImageFromProduct = (productId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_START })
            let res = await getAllProductImageFromProductService(productId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_SUCCESS,
                    dataProductImage: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_FAILED
            })
            console.log("FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_FAILED: ", error);
        }
    }
}
export const fetchAllBanners = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_BANNER_START })
            let res = await getAllBanners();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_BANNER_SUCCESS,
                    dataBanner: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_BANNER_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_BANNER_FAILED
            })
            console.log("FETCH_ALL_BANNER_FAILED: ", error);
        }
    }
}
export const fetchListBanners = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_LIST_BANNER_START })
            let res = await getListBanners('');
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_LIST_BANNER_SUCCESS,
                    dataListBanner: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_LIST_BANNER_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_LIST_BANNER_FAILED
            })
            console.log("FETCH_LIST_BANNER_FAILED: ", error);
        }
    }
}
export const fetchAllTypeShips = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_TYPE_SHIP_START })
            let res = await getAllTypeShips();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_TYPE_SHIP_SUCCESS,
                    dataTypeShip: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_TYPE_SHIP_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_TYPE_SHIP_FAILED
            })
            console.log("FETCH_ALL_TYPE_SHIP_FAILED: ", error);
        }
    }
}
export const fetchAllBlogs = (data) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_BLOG_START })
            let res = await getAllBlogs(data);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_BLOG_SUCCESS,
                    dataBlog: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_BLOG_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_BLOG_FAILED
            })
            console.log("FETCH_ALL_BLOG_FAILED: ", error);
        }
    }
}
export const fetchListBlogs = (limit) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_LIST_BLOG_START })
            let res = await getListBlogs(limit);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_LIST_BLOG_SUCCESS,
                    dataListBlog: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_LIST_BLOG_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_LIST_BLOG_FAILED
            })
            console.log("FETCH_LIST_BLOG_FAILED: ", error);
        }
    }
}
export const fetchAllTypeVouchers = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_TYPE_VOUCHER_START })
            let res = await getAllTypeVouchers();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_TYPE_VOUCHER_SUCCESS,
                    dataTypeVoucher: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_TYPE_VOUCHER_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_TYPE_VOUCHER_FAILED
            })
            console.log("FETCH_ALL_TYPE_VOUCHER_FAILED: ", error);
        }
    }
}
export const fetchAllVouchers = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_VOUCHER_START })
            let res = await getAllVouchers();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_VOUCHER_SUCCESS,
                    dataVoucher: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_VOUCHER_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_VOUCHER_FAILED
            })
            console.log("FETCH_ALL_VOUCHER_FAILED: ", error);
        }
    }
}
export const fetchAllVoucherByUserId = (userId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_VOUCHER_BY_USER_ID_START })
            let res = await getAllVoucherByUserId(userId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_VOUCHER_BY_USER_ID_SUCCESS,
                    dataVoucherByUserId: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_VOUCHER_BY_USER_ID_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_VOUCHER_BY_USER_ID_FAILED
            })
            console.log("FETCH_ALL_VOUCHER_BY_USER_ID_FAILED: ", error);
        }
    }
}
export const fetchAllReceiverByUserId = (userId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_RECEIVER_BY_USER_ID_START })
            let res = await getAllReceiverByUserIdService(userId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_RECEIVER_BY_USER_ID_SUCCESS,
                    dataReceiver: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_RECEIVER_BY_USER_ID_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_RECEIVER_BY_USER_ID_FAILED
            })
            console.log("FETCH_ALL_RECEIVER_BY_USER_ID_FAILED: ", error);
        }
    }
}
export const fetchAllOrderByUserId = (userId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_ORDER_BY_USER_ID_START })
            let res = await getAllOrderByUserIdService(userId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_ORDER_BY_USER_ID_SUCCESS,
                    dataOrderOfUser: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_ORDER_BY_USER_ID_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_ORDER_BY_USER_ID_FAILED
            })
            console.log("FETCH_ALL_ORDER_BY_USER_ID_FAILED: ", error);
        }
    }
}
export const fetchAllOrders = (statusId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_ORDER_START })
            let res = await getAllOrderService(statusId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_ORDER_SUCCESS,
                    dataOrders: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_ORDER_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_ORDER_FAILED
            })
            console.log("FETCH_ALL_ORDER_FAILED: ", error);
        }
    }
}
export const fetchDetailOrderById = (userId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ORDER_BY_ID_START })
            let res = await getDetailOrderByIdService(userId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ORDER_BY_ID_SUCCESS,
                    dataOrderById: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ORDER_BY_ID_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ORDER_BY_ID_FAILED
            })
            console.log("FETCH_ORDER_BY_ID_FAILED: ", error);
        }
    }
}
export const fetchAllCommentByProductId = (productId) => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_COMMENT_BY_PRODUCT_ID_START })
            let res = await getAllCommentByProductIdService(productId);
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_COMMENT_BY_PRODUCT_ID_SUCCESS,
                    dataCommentProduct: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_COMMENT_BY_PRODUCT_ID_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_COMMENT_BY_PRODUCT_ID_FAILED
            })
            console.log("FETCH_ALL_COMMENT_BY_PRODUCT_ID_FAILED: ", error);
        }
    }
}
export const fetchAllImports = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ALL_IMPORT_START })
            let res = await getAllImports();
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_IMPORT_SUCCESS,
                    dataImport: res.data,
                })
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_IMPORT_FAILED
                })
            }
        } catch (error) {
            dispatch({
                type: actionTypes.FETCH_ALL_IMPORT_FAILED
            })
            console.log("FETCH_ALL_IMPORT_FAILED: ", error);
        }
    }
}
