import actionTypes from '../actions/actionTypes';
const initialState = {
    genders: [],
    roles: [],
    users: [],
    category: [],
    brands: [],
    warranties: [],
    subjects: [],
    discounts: [],
    ageUseProducts: [],
    products: [],
    topProducts: [],
    newProducts: [],
    productImage: [],
    banners: [],
    listBanners: [],
    typeShips: [],
    blogs: [],
    listBlogs: [],
    typeVouchers: [],
    vouchers: [],
    voucherByUserId: [],
    receivers: [],
    user: {},
    ordersOfUser: [],
    statusOrder: [],
    orders: [],
    orderById: {},
    commentProduct: {},
    imports: [],
}
const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_ALLCODE_GENDER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_GENDER_SUCCESS:
            state.genders = action.dataGender;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_GENDER_FAILED:
            state.genders = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_ROLE_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_ROLE_SUCCESS:
            state.roles = action.dataRole;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_ROLE_FAILED:
            state.roles = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_CATEGORY_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_CATEGORY_SUCCESS:
            state.category = action.dataCategory;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_CATEGORY_FAILED:
            state.category = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_BRAND_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_BRAND_SUCCESS:
            state.brands = action.dataBrand;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_BRAND_FAILED:
            state.brands = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_WARRANTY_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_WARRANTY_SUCCESS:
            state.warranties = action.dataWarranty;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_WARRANTY_FAILED:
            state.warranties = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_SUBJECT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_SUBJECT_SUCCESS:
            state.subjects = action.dataSubject;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_SUBJECT_FAILED:
            state.subjects = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_DISCOUNT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_DISCOUNT_SUCCESS:
            state.discounts = action.dataDiscount;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_DISCOUNT_FAILED:
            state.discounts = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_AGE_USE_PRODUCT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_AGE_USE_PRODUCT_SUCCESS:
            state.ageUseProducts = action.dataAgeUseProduct;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_AGE_USE_PRODUCT_FAILED:
            state.ageUseProducts = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_STATUS_ORDER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_STATUS_ORDER_SUCCESS:
            state.statusOrder = action.dataStatusOrder;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALLCODE_STATUS_ORDER_FAILED:
            state.statusOrder = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USER_SUCCESS:
            state.users = action.users;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_USER_FAILED:
            state.users = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_DETAIL_USER_BY_ID_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_DETAIL_USER_BY_ID_SUCCESS:
            state.user = action.dataAUser;
            return {
                ...state,
            }
        case actionTypes.FETCH_DETAIL_USER_BY_ID_FAILED:
            state.user = {};
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_SUCCESS:
            state.products = action.dataProduct;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_FAILED:
            state.products = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_PRODUCT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_PRODUCT_SUCCESS:
            state.topProducts = action.dataTopProduct;
            return {
                ...state,
            }
        case actionTypes.FETCH_TOP_PRODUCT_FAILED:
            state.topProducts = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_NEW_PRODUCT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_NEW_PRODUCT_SUCCESS:
            state.newProducts = action.dataNewProduct;
            return {
                ...state,
            }
        case actionTypes.FETCH_NEW_PRODUCT_FAILED:
            state.newProducts = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_SUCCESS:
            state.productImage = action.dataProductImage;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_PRODUCT_IMAGE_FORM_PRODUCT_FAILED:
            state.productImage = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_BANNER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_BANNER_SUCCESS:
            state.banners = action.dataBanner;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_BANNER_FAILED:
            state.banners = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_BANNER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_BANNER_SUCCESS:
            state.listBanners = action.dataListBanner;
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_BANNER_FAILED:
            state.listBanners = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_TYPE_SHIP_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_TYPE_SHIP_SUCCESS:
            state.typeShips = action.dataTypeShip;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_TYPE_SHIP_FAILED:
            state.typeShips = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_BLOG_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_BLOG_SUCCESS:
            state.blogs = action.dataBlog;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_BLOG_FAILED:
            state.blogs = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_BLOG_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_BLOG_SUCCESS:
            state.listBlogs = action.dataListBlog;
            return {
                ...state,
            }
        case actionTypes.FETCH_LIST_BLOG_FAILED:
            state.listBlogs = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_TYPE_VOUCHER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_TYPE_VOUCHER_SUCCESS:
            state.typeVouchers = action.dataTypeVoucher;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_TYPE_VOUCHER_FAILED:
            state.typeVouchers = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_VOUCHER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_VOUCHER_SUCCESS:
            state.vouchers = action.dataVoucher;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_VOUCHER_FAILED:
            state.vouchers = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_VOUCHER_BY_USER_ID_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_VOUCHER_BY_USER_ID_SUCCESS:
            state.voucherByUserId = action.dataVoucherByUserId;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_VOUCHER_BY_USER_ID_FAILED:
            state.voucherByUserId = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_RECEIVER_BY_USER_ID_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_RECEIVER_BY_USER_ID_SUCCESS:
            state.receivers = action.dataReceiver;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_RECEIVER_BY_USER_ID_FAILED:
            state.receivers = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_ORDER_BY_USER_ID_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_ORDER_BY_USER_ID_SUCCESS:
            state.ordersOfUser = action.dataOrderOfUser;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_ORDER_BY_USER_ID_FAILED:
            state.ordersOfUser = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_ORDER_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_ORDER_SUCCESS:
            state.orders = action.dataOrders;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_ORDER_FAILED:
            state.orders = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ORDER_BY_ID_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ORDER_BY_ID_SUCCESS:
            state.orderById = action.dataOrderById;
            return {
                ...state,
            }
        case actionTypes.FETCH_ORDER_BY_ID_FAILED:
            state.orderById = {};
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_COMMENT_BY_PRODUCT_ID_START:
            console.log("check fetch all  comment");
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_COMMENT_BY_PRODUCT_ID_SUCCESS:
            state.commentProduct = action.dataCommentProduct;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_COMMENT_BY_PRODUCT_ID_FAILED:
            state.commentProduct = [];
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_IMPORT_START:
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_IMPORT_SUCCESS:
            state.imports = action.dataImport;
            return {
                ...state,
            }
        case actionTypes.FETCH_ALL_IMPORT_FAILED:
            state.imports = [];
            return {
                ...state,
            }
        default:
            return state;
    }
}
export default adminReducer;