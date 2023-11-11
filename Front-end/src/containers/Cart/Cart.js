import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { createNewReceiverService, deleteItemCartByUserIdService, deleteItemCartService, handleSendVerifyEmail } from '../../services/userService';
import * as actions from "../../store/actions";
import HomeNav from '../HomePage/HomeNav';
import HomeFooter from '../HomePage/HomeFooter';
import "./Cart.scss"
import Lightbox from 'react-image-lightbox';
import { CRUD_ACTIONS } from '../../utils';
import DeleteShopCartModal from './DeleteShopCartModal';
import ReceiverModal from './ReceiverModal';
import { withRouter } from 'react-router';
import { emitter } from '../../utils/emitter';
import LoadingOverlay from 'react-loading-overlay';
class Cart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataItemOfCart: [],
            errMessage: "",
            isOpen: false,
            id: '',
            sumCart: 0,
            action: '',
            isOpenModal: false,
            productId: '',
            userId: '',
            name: '',
            isOpenModalReceiver: false,
            arrReceiver: '',
            isShowLoading: false
        }
    }
    async componentDidMount() {
        let userId = this.props.userInfo.id
        if (userId) {
            this.props.fetchAllReceiverByUserId(userId)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.userInfo !== this.props.userInfo) {
        //     this.setState({
        //         dataItemOfCart: this.props.dataItemOfCartRedux
        //     })
        // }
        if (prevProps.dataItemOfCartRedux !== this.props.dataItemOfCartRedux) {
            this.setState({
                dataItemOfCart: this.props.dataItemOfCartRedux
            })
        }
        if (prevProps.receivers !== this.props.receivers) {
            this.setState({
                arrReceiver: this.props.receivers
            })
        }
    }
    handleDeleteItemCart = async () => {
        try {
            let res = await deleteItemCartService(this.state.productId);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                const { userInfo } = this.props;
                if (userInfo && userInfo.id) {
                    this.props.fetchAllCartByUserId(userInfo.id)
                    this.closeModal()
                }
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }
    openModal = (item) => {
        this.setState({
            isOpenModal: true,
            productId: item.Cart.productId,
            name: item.name
        })
    }
    closeModal = () => {
        this.setState({
            isOpenModal: false,
            productId: '',
            name: ''
        })
    }
    handleEditItemCart = (item) => {
        this.setState({
            action: CRUD_ACTIONS.EDIT,
            productId: item.id,
            userId: item.Cart.userId
        })
    }
    handleOnChangeInput = (event) => {
        try {
            if (event.target.value === "0") {
                this.setState({
                    isOpenModal: true
                })
            } else {
                if (event.target.value) {
                    let res = this.props.fetchAddItemCart({
                        type: 'UPDATE_QUANTITY',
                        userId: this.state.userId,
                        productId: this.state.productId,
                        quantity: event.target.value,
                    })
                    if (res.errCode === 2) {
                        this.setState({
                            quantity: res.quantity
                        })
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleSaveChangeItemCart = () => {
        this.setState({
            action: '',
            productId: '',
            userId: '',
        })
    }
    openPreviewImage = (item) => {
        this.setState({
            isOpen: true,
            id: item.id
        })
    }
    handleDeleteCart = async (userId, itemCart) => {
        try {
            if (itemCart.length <= 0) {
                toast.error(<FormattedMessage id={"cart.no-cart"} />)
            } else {
                let res = await deleteItemCartByUserIdService(userId)
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage)
                    this.props.fetchAllCartByUserId(userId)
                } else {
                    toast.error(res.errMessage)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleOrder = async (itemCart) => {
        if (itemCart.length <= 0) {
            toast.error(<FormattedMessage id={"cart.no-cart-payment"} />)
        } else {
            this.setState({
                isShowLoading: true
            })
            let { arrReceiver } = this.state
            if (arrReceiver && arrReceiver.length > 0) {
                let { userInfo } = this.props
                if (userInfo.ActiveEmail === 1) {
                    this.props.history.push(`/order/${userInfo.id}`);
                } else {
                    let res = await handleSendVerifyEmail({ id: userInfo.id })
                    this.setState({
                        isShowLoading: false
                    })
                    if (res && res.errCode === 0) {
                        toast.error(<FormattedMessage id={"cart.check-mail"} />)
                    } else {
                        toast.error(<FormattedMessage id={"error"} />)
                    }
                }
            } else {
                this.setState({
                    isShowLoading: false
                })
                this.toggleReceiverModal()
            }
        }
    }
    toggleReceiverModal = () => {
        this.setState({
            isOpenModalReceiver: !this.state.isOpenModalReceiver
        })
    }
    sendDataFromModalReceiver = async (data) => {
        let userId = this.props.userInfo.id
        let res = await createNewReceiverService({
            name: data.name,
            address: data.address,
            email: data.email,
            phoneNumber: data.phoneNumber,
            userId: userId,
            status: 1
        })
        if (res && res.errCode === 0) {
            toast.success(res.errMessage)
            this.props.history.push(`/order/${userId}`);
            this.toggleReceiverModal();
            emitter.emit('EVENT_CLEAR_MODAL_DATA')
        } else {
            toast.error(res.errMessage)
        }
    }
    render() {
        let { dataItemOfCart, isOpen, productId, sumCart, action, id, isOpenModal, name, isShowLoading } = this.state;
        return (
            <>
                <LoadingOverlay
                    active={isShowLoading}
                    spinner
                    text='Loading...'>
                    <HomeNav />
                    <div className='container cart-page'>
                        <div className='title'>
                            <FormattedMessage id={"cart.title"} />
                        </div>
                        <table class="table table-striped table-item-cart">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        <FormattedMessage id={"cart.detail"} />
                                    </th>
                                    <th scope="col">
                                        <FormattedMessage id={"cart.price"} />
                                    </th>
                                    <th scope="col">
                                        <FormattedMessage id={"cart.quantity"} />
                                    </th>
                                    <th scope="col">
                                        <FormattedMessage id={"cart.sum-product"} />
                                    </th>
                                    <th scope="col">
                                        <FormattedMessage id={"cart.action"} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataItemOfCart && !_.isEmpty(dataItemOfCart) && dataItemOfCart.ProductUserCartData && dataItemOfCart.ProductUserCartData.length > 0 &&
                                    dataItemOfCart.ProductUserCartData.map((item, index) => {
                                        sumCart += item.Cart.quantity * item.discountPrice;
                                        console.log("check sum cart: ", sumCart);
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className='cart-detail-product'>
                                                        <div className='cart-name-product'>
                                                            {item.name}
                                                        </div>
                                                        <div className='cart-image-product'
                                                            style={{ backgroundImage: `url(${item.productImageData[0].image})` }}
                                                            onClick={() => this.openPreviewImage(item)}
                                                        >
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>
                                                    {action === CRUD_ACTIONS.EDIT && productId === item.id ?
                                                        <input className='form-control'
                                                            value={item.Cart.quantity}
                                                            type='number' style={{ width: "80px" }}
                                                            onChange={(event) => this.handleOnChangeInput(event)} />
                                                        :
                                                        item.Cart.quantity
                                                    }

                                                </td>
                                                <td>{(item.Cart.quantity * item.discountPrice).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td >
                                                    <div className='btn-manage'>

                                                        {action === CRUD_ACTIONS.EDIT && productId === item.id ?
                                                            <button
                                                                className='btn-save' title='Lưu thay đổi'
                                                                onClick={() => this.handleSaveChangeItemCart()}
                                                            >
                                                                <i className="fas fa-save"></i>
                                                            </button>

                                                            :
                                                            <button
                                                                className='btn-edit' title='Chỉnh sửa số lượng'
                                                                onClick={() => this.handleEditItemCart(item)}
                                                            >
                                                                <i className="fas fa-pencil-alt"></i>
                                                            </button>
                                                        }
                                                        <button
                                                            className='btn-delete' title='Xoá sản phẩm'
                                                            onClick={() => this.openModal(item)}
                                                        ><i className="fas fa-trash"></i>
                                                            <DeleteShopCartModal handleDeleteShopCart={this.handleDeleteItemCart} name={name} isOpenModal={isOpenModal}
                                                                closeModal={this.closeModal} />
                                                        </button>
                                                    </div>
                                                </td>

                                                {
                                                    isOpen === true && id === item.id &&
                                                    <Lightbox
                                                        mainSrc={item.productImageData[0].image}
                                                        onCloseRequest={() => this.setState({ isOpen: false })}
                                                    />
                                                }
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                        {dataItemOfCart && !_.isEmpty(dataItemOfCart) &&
                            <div className='payment-cart'>
                                <div className='sum-cart'>
                                    <FormattedMessage id={"cart.sum-price"} /> ( {dataItemOfCart.ProductUserCartData ? dataItemOfCart.ProductUserCartData.length : 0} <FormattedMessage id={"cart.product"} />): {sumCart ? sumCart.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : 0}
                                </div>
                                <div className='no-ship-cart my-2'><FormattedMessage id={"cart.no-price-ship"} /></div>
                                <div className='action-cart'>
                                    <div className='delete-cart' onClick={() => this.handleDeleteCart(dataItemOfCart.id, dataItemOfCart.ProductUserCartData)}>
                                        <FormattedMessage id={"cart.delete-cart"} />
                                    </div>
                                    <div className='go-payment' onClick={() => this.handleOrder(dataItemOfCart.ProductUserCartData)}>
                                        <FormattedMessage id={"cart.payment"} />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <HomeFooter />
                </LoadingOverlay>
                <ReceiverModal
                    isOpen={this.state.isOpenModalReceiver}
                    toggleFromParent={this.toggleReceiverModal}
                    sendDataFromModalReceiver={this.sendDataFromModalReceiver}
                />

            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        dataItemOfCartRedux: state.cart.listCartItem,
        receivers: state.admin.receivers
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllCartByUserId: (id) => dispatch(actions.fetchAllCartByUserId(id)),
        fetchAddItemCart: (data) => dispatch(actions.fetchAddItemCart(data)),
        fetchAllReceiverByUserId: (userId) => dispatch(actions.fetchAllReceiverByUserId(userId))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Cart));
