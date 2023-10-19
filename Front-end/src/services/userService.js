import axios from '../axios';
const handleLogin = (data) => {
    return axios.post(`/api/login`, data)
}
const sendForgotPassword = (email) => {
    return axios.post(`/api/send-forgot-password`, email)
}
const handleResetPassword = (data) => {
    return axios.post(`/api/reset-password`, data)
}
const createANewUser = (data) => {
    return axios.post(`/api/create-a-new-user`, data)
}
const deleteUserService = (userId) => {
    return axios.delete('/api/delete-a-user', { data: { id: userId } })
}
const editUserService = (data) => {
    return axios.put('/api/edit-a-user', data)
}
const getAllUsers = (statusId) => {
    return axios.get(`/api/get-all-user?statusId=${statusId}`)
}
const handleChangePassword = (data) => {
    return axios.put('/api/change-password', data)
}
const handleChangeStatusUser = (data) => {
    return axios.put('/api/change-status-user', data)
}
const getDetailUserById = (id) => {
    return axios.get(`/api/get-detail-user-by-id?id=${id}`)
}
const handleSendVerifyEmail = (data) => {
    return axios.post(`/api/send-verify-email`, data)
}
const handleVerifyEmail = (data) => {
    return axios.post(`/api/verify-email`, data)
}
const getAllCodeService = (type) => {
    return axios.get(`/api/get-all-code?type=${type}`)
}
const createANewAllCode = (data) => {
    return axios.post(`/api/create-new-all-code`, data)
}
const editAllCodeService = (data) => {
    return axios.put('/api/update-all-code', data)
}
const deleteAllCodeService = (allCodeId) => {
    return axios.delete('/api/delete-all-code', { data: { id: allCodeId } })
}
const createNewProduct = (data) => {
    return axios.post(`/api/create-new-product`, data)
}
const getAllProducts = (data) => {
    return axios.get(`/api/get-all-product?statusId=${data.statusId}&&categoryId=${data.categoryId}&&brandId=${data.brandId}&&sortName=${data.sortName}&&sortPrice=${data.sortPrice}&&sortPercent=${data.sortPercent}&&valueSearch=${data.valueSearch}&&sortView=${data.sortView}&&sortCreatedAt=${data.sortCreatedAt}&&sortCount=${data.sortCount}`)
}
const getDetailProductById = (id) => {
    return axios.get(`/api/get-detail-product-by-id?id=${id}`)
}
const getTopProductHomePage = (limit, typeSort) => {
    return axios.get(`/api/get-top-product-home-page?limit=${limit}&typeSort=${typeSort}`)
}
const editProductService = (data) => {
    return axios.put('/api/update-product', data)
}
const deleteProductService = (data) => {
    return axios.delete('/api/delete-product', { data: data })
}
const handleChangeStatusProduct = (data) => {
    return axios.put('/api/change-status-product', data)
}

const getAllProductImageFromProductService = (productId) => {
    return axios.get(`/api/get-all-product-image-from-product?productId=${productId}`)
}
const createNewProductImageService = (data) => {
    return axios.post(`/api/create-new-product-image`, data)
}
const editProductImageService = (data) => {
    return axios.put('/api/update-product-image', data)
}
const deleteProductImageService = (id) => {
    return axios.delete('/api/delete-product-image', { data: { id: id } })
}

const createNewBannerService = (data) => {
    return axios.post(`/api/create-new-banner`, data)
}
const editBannerService = (data) => {
    return axios.put('/api/update-banner', data)
}
const deleteBannerService = (id) => {
    return axios.delete('/api/delete-banner', { data: { id: id } })
}
const getAllBanners = () => {
    return axios.get(`/api/get-all-banner`)
}
const getListBanners = (limit) => {
    return axios.get(`/api/get-list-banner?limit=${limit}`)
}
const handleChangeStatusBanner = (data) => {
    return axios.put('/api/change-status-banner', data)
}

const createNewTypeShipService = (data) => {
    return axios.post(`/api/create-new-type-ship`, data)
}
const editTypeShipService = (data) => {
    return axios.put('/api/update-type-ship', data)
}
const deleteTypeShipService = (id) => {
    return axios.delete('/api/delete-type-ship', { data: { id: id } })
}
const getAllTypeShips = () => {
    return axios.get(`/api/get-all-type-ship`)
}

const createNewBlogService = (data) => {
    return axios.post(`/api/create-new-blog`, data)
}
const editBlogService = (data) => {
    return axios.put('/api/update-blog', data)
}
const deleteBlogService = (id) => {
    return axios.delete('/api/delete-blog', { data: { id: id } })
}
const getAllBlogs = (data) => {
    return axios.get(`/api/get-all-blog?statusId=${data.statusId}&&subjectId=${data.subjectId}&&valueSearch=${data.valueSearch}`)
}
const getListBlogs = (limit) => {
    return axios.get(`/api/get-list-blog?limit=${limit}`)
}
const getDetailBlogById = (id) => {
    return axios.get(`/api/get-detail-blog-by-id?id=${id}`)
}
const handleChangeStatusBlog = (data) => {
    return axios.put('/api/change-status-blog', data)
}

const createNewTypeVoucherService = (data) => {
    return axios.post(`/api/create-new-type-voucher`, data)
}
const editTypeVoucherService = (data) => {
    return axios.put('/api/update-type-voucher', data)
}
const deleteTypeVoucherService = (id) => {
    return axios.delete('/api/delete-type-voucher', { data: { id: id } })
}
const getAllTypeVouchers = () => {
    return axios.get(`/api/get-all-type-voucher`)
}

const createNewVoucherService = (data) => {
    return axios.post(`/api/create-new-voucher`, data)
}
const editVoucherService = (data) => {
    return axios.put('/api/update-voucher', data)
}
const deleteVoucherService = (id) => {
    return axios.delete('/api/delete-voucher', { data: { id: id } })
}
const getAllVouchers = () => {
    return axios.get(`/api/get-all-voucher`)
}
const saveUserVoucherService = (data) => {
    return axios.post(`/api/save-user-voucher`, data)
}
const getDetailVoucherById = (id) => {
    return axios.get(`/api/get-detail-voucher?id=${id}`)
}
const getAllVoucherByUserId = (userId) => {
    return axios.get(`/api/get-all-voucher-user-used-by-user-id?userId=${userId}`)
}

const handleAddCartService = (data) => {
    return axios.post(`/api/add-cart`, data)
}
const getAllCartByUserIdService = (userId) => {
    return axios.get(`/api/get-all-cart-by-user-id?id=${userId}`)
}
const deleteItemCartService = (productId) => {
    return axios.delete(`/api/delete-item-cart`, { data: { productId: productId } })
}
const deleteItemCartByUserIdService = (userId) => {
    return axios.delete(`/api/delete-item-cart-by-user-id`, { data: { userId: userId } })
}


const createNewReceiverService = (data) => {
    return axios.post(`/api/create-new-receiver`, data)
}
const editReceiverService = (data) => {
    return axios.put('/api/update-receiver', data)
}
const deleteReceiverService = (id) => {
    return axios.delete('/api/delete-receiver', { data: { id: id } })
}
const getAllReceiverByUserIdService = (userId) => {
    return axios.get(`/api/get-all-receiver-by-user-id?userId=${userId}`)
}
const getDetailReceiverById = (id) => {
    return axios.get(`/api/get-detail-receiver-by-id?id=${id}`)
}

const createNewOrderService = (data) => {
    return axios.post(`/api/create-new-order`, data)
}
const updateStatusOrderService = (data) => {
    return axios.put('/api/update-status-order', data)
}
const getDetailOrderByIdService = (id) => {
    return axios.get(`/api/get-detail-order?id=${id}`)
}
const getAllOrderByUserIdService = (userId) => {
    return axios.get(`/api/get-all-order-by-user-id?userId=${userId}`)
}
const getAllOrderService = (statusId) => {
    return axios.get(`/api/get-all-order?statusId=${statusId}`)
}
const handleChangeStatusService = (data) => {
    return axios.put('/api/change-status-receiver', data)
}

const createNewCommentService = (data) => {
    return axios.post(`/api/create-new-comment`, data)
}
const replyComment = (data) => {
    return axios.post('/api/reply-comment', data)
}
const deleteCommentService = (id) => {
    return axios.delete('/api/delete-comment', { data: { id: id } })
}
const getAllCommentByProductIdService = (productId) => {
    return axios.get(`/api/get-all-comment-by-product-id?id=${productId}`)
}
const createNewImportService = (data) => {
    return axios.post(`/api/create-new-import-product`, data)
}
const editImportService = (data) => {
    return axios.put('/api/update-import-product', data)
}
const deleteImportService = (id) => {
    return axios.delete('/api/delete-import-product', { data: { id: id } })
}
const getAllImports = () => {
    return axios.get(`/api/get-all-import-product`)
}
const paymentPayPalService = (data) => {
    return axios.post(`/api/payment-paypal`, data)
}
const paymentPayPalSuccessService = (data) => {
    return axios.post(`/api/payment-paypal-success`, data)
}
const paymentMomoService = (data) => {
    return axios.post(`/api/payment-momo`, data)
}
const handleLoginWithGoogle = () => {
    return axios.get('/api/auth/google')
}
export {
    handleLogin, sendForgotPassword, handleResetPassword, getAllCodeService, getDetailUserById, createANewUser, deleteUserService, editUserService, getAllUsers, handleChangePassword, handleChangeStatusUser, handleSendVerifyEmail, handleVerifyEmail, editAllCodeService, deleteAllCodeService, createANewAllCode, createNewProduct, getAllProducts, getDetailProductById, getTopProductHomePage, editProductService, handleChangeStatusProduct, deleteProductService, getAllProductImageFromProductService, createNewProductImageService, editProductImageService, deleteProductImageService, getAllBanners, getListBanners, createNewBannerService, editBannerService, deleteBannerService, handleChangeStatusBanner, createNewTypeShipService, editTypeShipService, deleteTypeShipService, getAllTypeShips, createNewBlogService, editBlogService, deleteBlogService, getAllBlogs, getDetailBlogById, getListBlogs, handleChangeStatusBlog, createNewTypeVoucherService, editTypeVoucherService, deleteTypeVoucherService, getAllTypeVouchers, createNewVoucherService, editVoucherService, deleteVoucherService, getAllVouchers, saveUserVoucherService, getDetailVoucherById, getAllVoucherByUserId, handleAddCartService, getAllCartByUserIdService, deleteItemCartService, deleteItemCartByUserIdService, createNewReceiverService, editReceiverService, deleteReceiverService, getAllReceiverByUserIdService, getDetailReceiverById, createNewOrderService, updateStatusOrderService, getDetailOrderByIdService, getAllOrderByUserIdService, getAllOrderService, handleChangeStatusService, createNewCommentService, replyComment, deleteCommentService, getAllCommentByProductIdService, createNewImportService, editImportService, getAllImports, deleteImportService, paymentPayPalService, paymentPayPalSuccessService, paymentMomoService, handleLoginWithGoogle
}