import _, { random, round } from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import { emitter } from '../../utils/emitter';
import HomeNav from '../HomePage/HomeNav';
import AddressOrder from './AddressOrder';
import moment from 'moment';
import "./Order.scss"
import VoucherModal from '../Voucher/VoucherModal';
import { toast } from 'react-toastify';
import { createNewOrderService, paymentMomoService, paymentPayPalService } from '../../services/userService';
import HomeFooter from '../HomePage/HomeFooter';
import { withRouter } from 'react-router';
import { path } from '../../utils';
const USD = process.env.REACT_APP_RATE_USD

class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataItemOfCart: '',
            sumCart: 0,
            arrTypeShips: [],
            isOpenModalVoucher: false,
            arrVoucher: [],
            selectedVoucher: '',
            selectedTypeShip: '',
            receiverId: '',
            note: '',
            isPaymentOnl: 0,
            isPaymentSelect: 0, // 1: Paypal 0:Momo
        }
    }
    async componentDidMount() {
        window.scrollTo(0, 0)
        let userId = this.props.userInfo.id
        if (userId) {
            this.props.fetchAllCartByUserId(userId)
            await this.props.fetchAllVoucherByUserId(userId)
        }
        this.props.fetchAllTypeShips()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.dataItemOfCartRedux !== this.props.dataItemOfCartRedux) {
            this.setState({
                dataItemOfCart: this.props.dataItemOfCartRedux
            })
        }
        if (prevProps.listTypeShips !== this.props.listTypeShips) {
            let data = this.props.listTypeShips;
            if (data && data.length > 0) {
                data.map(item => ({ ...item, isSelected: false }))
            }
            this.setState({
                arrTypeShips: data
            })
        }
        if (prevProps.listVoucherByUserId !== this.props.listVoucherByUserId) {
            this.getDataVouchers()
        }
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    handleClickBtnTypeShip = (typeShip) => {
        let copyState = { ...this.state }
        copyState.selectedTypeShip = typeShip
        this.setState({
            ...copyState
        })
    }
    getDataVouchers = async () => {
        let { listVoucherByUserId } = this.props
        let arrTemp = []
        if (listVoucherByUserId && listVoucherByUserId.length > 0) {
            let nowDate = moment.unix(Date.now() / 1000).format('YYYY/MM/DD')
            listVoucherByUserId.map((item) => {
                let fromDate = moment.unix(item.fromDate / 1000).format('YYYY/MM/DD');
                let toDate = moment.unix(item.toDate / 1000).format('YYYY/MM/DD');
                if (item.number !== item.numberUsed && moment(fromDate).isSameOrBefore(nowDate) === true && moment(toDate).isSameOrAfter(nowDate) === true) {
                    arrTemp.push(item)
                }
            })
        }
        this.setState({
            arrVoucher: arrTemp
        })
    }
    compareDates = (d1, d2) => {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]); //yyyymmdd
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);
        if (d1 <= d2) return true
        if (d1 >= d2) return false
    }
    toggleVoucherModal = () => {
        this.setState({
            isOpenModalVoucher: !this.state.isOpenModalVoucher
        })
    }
    getIdVoucher = (id) => {
        let { arrVoucher, selectedVoucher } = this.state
        if (arrVoucher && arrVoucher.length > 0) {
            selectedVoucher = arrVoucher.find(item => {
                return item && item.id === id
            })
        }
        this.setState({
            selectedVoucher
        })
        this.toggleVoucherModal()
        emitter.emit('EVENT_CLEAR_MODAL_DATA')
    }
    totalPriceDiscount = (price, discount) => {
        if (!discount || price <= discount.typeVoucherOfVoucherData.minValue) {
            return price;
        } else {
            if (discount.typeVoucherOfVoucherData.type === "percent") {
                if (((price * discount.typeVoucherOfVoucherData.value) / 100) > discount.typeVoucherOfVoucherData.maxValue) {

                    return price - discount.typeVoucherOfVoucherData.maxValue
                } else {
                    return price - ((price * discount.typeVoucherOfVoucherData.value) / 100)
                }
            } else {
                return price - discount.typeVoucherOfVoucherData.value
            }
        }
    }
    handleOrder = async (totalPriceDiscount) => {
        let { selectedTypeShip, dataItemOfCart, receiverId, selectedVoucher, note, isPaymentOnl, isPaymentSelect } = this.state
        if (dataItemOfCart.ProductUserCartData.length <= 0) {
            toast.error("Không có sản phẩm. Không thể tiến hành đặt hàng!")
        } else {
            if (!selectedTypeShip) {
                toast.error("Chưa chọn đơn vị vận chuyển!")
            } else {
                let result = [];
                dataItemOfCart.ProductUserCartData.map((item, index) => {
                    let object = {};
                    object.productId = item.Cart.productId
                    object.quantity = item.Cart.quantity
                    object.realPrice = item.discountPrice
                    result.push(object)
                })
                let userId = this.props.userInfo.id
                if (userId) {
                    console.log("check result: ", result);
                    if (isPaymentOnl === 0) {
                        let res = await createNewOrderService({
                            orderDate: Date.now(),
                            receiverId: receiverId,
                            typeShipId: selectedTypeShip.id,
                            voucherId: selectedVoucher.id,
                            note: note,
                            //totalPayment: totalPriceDiscount > 0 ? totalPriceDiscount + selectedTypeShip.price : selectedTypeShip.price,
                            totalPayment: totalPriceDiscount,
                            userId: userId,
                            arrDataCart: result
                        })
                        if (res && res.errCode === 0) {
                            toast.success(res.errMessage)
                            await this.props.fetchAllCartByUserId(userId)
                            setTimeout(() => {
                                this.props.history.push(`/user/order/${userId}`)
                            }, 3000)
                        } else {
                            toast.error(res.errMessage)
                        }
                    } else {
                        if (isPaymentSelect === 1) {
                            let VNDtoUSD = (item1 => item1 / +USD)
                            let items = [];
                            dataItemOfCart.ProductUserCartData.map((item, index) => {
                                let object = {};
                                object.name = item.name + " | " + item.brandId
                                object.sku = item.Cart.productId + ''
                                object.price = '' + VNDtoUSD(item.discountPrice).toFixed(2)
                                object.currency = "USD"
                                object.quantity = item.Cart.quantity
                                items.push(object)
                            })
                            items.push({
                                "name": "Phi ship",
                                "sku": "S1",
                                "price": VNDtoUSD(selectedTypeShip.price).toFixed(2) + "",
                                "currency": "USD",
                                "quantity": 1
                            })
                            console.log(VNDtoUSD(totalPriceDiscount > 0 ? totalPriceDiscount + selectedTypeShip.price : selectedTypeShip.price));
                            let res = await paymentPayPalService({
                                totalPayment: '' + VNDtoUSD(totalPriceDiscount > 0 ? totalPriceDiscount + selectedTypeShip.price : selectedTypeShip.price).toFixed(2),
                                items,
                            })

                            if (res && res.errCode === 0) {
                                localStorage.setItem("orderData", JSON.stringify({
                                    orderDate: Date.now(),
                                    receiverId: receiverId,
                                    isPaymentOnl: isPaymentOnl === 1 ? 1 : 0,
                                    typeShipId: selectedTypeShip.id,
                                    voucherId: selectedVoucher.id,
                                    note: note,
                                    userId: userId,
                                    arrDataCart: result,
                                    totalPayment: totalPriceDiscount,
                                    totalPaymentUSD: '' + VNDtoUSD(totalPriceDiscount > 0 ? totalPriceDiscount + selectedTypeShip.price : selectedTypeShip.price).toFixed(2)
                                }))
                                window.location.href = res.link
                            }
                            //window.location.href = path.INFO_PAYMENT 
                        } else {
                            try {
                                let orderId = _.random(1, 999999) + ''
                                let data = {
                                    amount: "" + (totalPriceDiscount > 0 ? totalPriceDiscount + selectedTypeShip.price : selectedTypeShip.price),
                                    orderId,
                                    orderInfo: `Thanh toán đơn hàng ${orderId}`,
                                }
                                let res = await paymentMomoService(data)
                                if (res && res.res.errorCode === 0) {
                                    localStorage.setItem("orderData", JSON.stringify({
                                        orderDate: Date.now(),
                                        receiverId: receiverId,
                                        isPaymentOnl: isPaymentOnl === 1 ? 1 : 0,
                                        typeShipId: selectedTypeShip.id,
                                        voucherId: selectedVoucher.id,
                                        note: note,
                                        userId: userId,
                                        arrDataCart: result,
                                        totalPayment: totalPriceDiscount,
                                        requestId: `ID-${orderId}`
                                    }))
                                    window.location.href = res.res.payUrl
                                    console.log("check res: ", res.res.payUrl);
                                }
                            } catch (error) {
                                console.error('Failed to generate payment URL: ', error);
                            }
                        }

                    }

                }
            }
        }
    }
    getReceiverId = (id) => {
        this.setState({
            receiverId: id
        })
    }
    setIsPaymentOnl = (number, id) => {
        let copyState = { ...this.state };
        copyState[id] = number;
        this.setState({
            ...copyState
        })
    }
    render() {
        let { dataItemOfCart, sumCart, arrTypeShips, selectedVoucher, selectedTypeShip, isPaymentOnl, isPaymentSelect } = this.state
        console.log("check state: ", this.state);
        return (
            <>
                <HomeNav />
                <div className="container order">
                    <div className='row'>
                        <div className='title'>
                            <FormattedMessage id={"order.title"} />
                        </div>
                        <div className='horizontal-line'></div>
                        <AddressOrder
                            userId={this.props.userInfo ? this.props.userInfo.id : ''}
                            getReceiverId={this.getReceiverId}
                        />
                    </div>
                    <div className='product'>
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Thông tin chi tiết sản phẩm</th>
                                    <th scope="col">Đơn giá</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Tổng giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataItemOfCart && !_.isEmpty(dataItemOfCart) && dataItemOfCart.ProductUserCartData && dataItemOfCart.ProductUserCartData.length > 0 &&
                                    dataItemOfCart.ProductUserCartData.map((item, index) => {
                                        sumCart += item.Cart.quantity * item.discountPrice;
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className='cart-detail-product'>
                                                        <div className='cart-image-product'
                                                            style={{ backgroundImage: `url(${item.productImageData[0].image})` }}
                                                        >
                                                        </div>
                                                        <div className='cart-name-product'>
                                                            {item.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{item.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                <td>{item.Cart.quantity}</td>
                                                <td>{(item.Cart.quantity * item.discountPrice).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        </table>
                        <div className='row note-type-ship pt-4'>
                            <div className='col-4'>
                                <label>
                                    <FormattedMessage id={"order.note"} /></label>
                                <div className='input-group'>
                                    <input type='text' className='form-control'
                                        onChange={(event) => this.handleOnChangeInput(event, "note")}
                                        placeholder="Lưu ý cho người bán..."
                                        value={this.state.note}
                                    />
                                </div>
                            </div>
                            <div className='col-8'>
                                <label>
                                    <FormattedMessage id={"order.type-ship"} /></label>
                                <div className='all-type-ship'>
                                    {arrTypeShips && arrTypeShips.length > 0 &&
                                        arrTypeShips.map((item, index) => {
                                            return (
                                                <button key={index} className={item.id === selectedTypeShip.id ? "btn-type-ship mx-2 active" : "btn-type-ship mx-2"}
                                                    onClick={() => this.handleClickBtnTypeShip(item)}>
                                                    <div>{item.type}</div>
                                                    <div>{item.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                                </button>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="wrap-voucher py-4">
                            <div className='logo-my-voucher'></div>
                            <span onClick={() => this.toggleVoucherModal()} className="choose-voucher"><FormattedMessage id={"order.choose-voucher"} /></span>
                            {selectedVoucher && !_.isEmpty(selectedVoucher) &&
                                <>
                                    &emsp;&emsp;&emsp;
                                    <span className="choose-voucher"><FormattedMessage id={"order.using-voucher"} /> {selectedVoucher.codeVoucher}</span>
                                </>
                            }

                        </div>
                        <div className='payment-methods py-4'>
                            <FormattedMessage id={"order.payment-methods"} />
                            <span className={isPaymentOnl === 1 ? 'ship active' : 'ship'}
                                onClick={() => this.setIsPaymentOnl(1, "isPaymentOnl")}
                            >
                                <FormattedMessage id={"order.payment-onl"} />
                            </span>
                            <span className={isPaymentOnl === 0 ? 'ship active' : 'ship'}
                                onClick={() => this.setIsPaymentOnl(0, "isPaymentOnl")}
                            >
                                <FormattedMessage id={"order.ship-cod"} />
                            </span>
                            <div className='payment-onl' style={isPaymentOnl === 0 ? { visibility: "hidden" } : { visibility: "visible" }}>
                                <span className={isPaymentSelect === 0 ? 'type-payment active mx-3' : 'type-payment mx-3'}
                                    onClick={() => this.setIsPaymentOnl(0, "isPaymentSelect")}><FormattedMessage id={"order.payment-momo"} /></span>
                                <span className={isPaymentSelect === 1 ? 'type-payment active' : 'type-payment'}
                                    onClick={() => this.setIsPaymentOnl(1, "isPaymentSelect")}><FormattedMessage id={"order.payment-paypal"} /></span>
                            </div>
                        </div>
                        <div className='payment-cart'>
                            <div className='sum-cart'>
                                <FormattedMessage id={"order.sum-cart"} /> ({dataItemOfCart && !_.isEmpty(dataItemOfCart) && dataItemOfCart.ProductUserCartData ? dataItemOfCart.ProductUserCartData.length : 0} <FormattedMessage id={"order.product"} />): {sumCart ? sumCart.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : 0}
                            </div>
                            {selectedVoucher && !_.isEmpty(selectedVoucher) &&
                                <div className='sum-voucher'>
                                    <FormattedMessage id={"order.sum-voucher"} />  {(sumCart - this.totalPriceDiscount(sumCart, selectedVoucher)).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                </div>
                            }
                            {selectedTypeShip && !_.isEmpty(selectedTypeShip) ?
                                <>
                                    <div className='price-ship'>
                                        <FormattedMessage id={"order.price-ship"} /> {selectedTypeShip.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                    </div>
                                    <div className='sum-bill'>
                                        <FormattedMessage id={"order.sum-bill"} /> {this.totalPriceDiscount(sumCart, selectedVoucher) > 0 ? (this.totalPriceDiscount(sumCart, selectedVoucher) + selectedTypeShip.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : selectedTypeShip.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                    </div>
                                </>
                                :
                                <div className='price-ship'>
                                    <FormattedMessage id={"order.no-ship"} />
                                </div>
                            }

                            <div className='go-payment' onClick={() => this.handleOrder(this.totalPriceDiscount(sumCart, selectedVoucher))}>
                                <FormattedMessage id={"order.order"} />
                            </div>
                        </div>
                    </div>
                </div>
                <HomeFooter />
                <VoucherModal
                    isOpen={this.state.isOpenModalVoucher}
                    toggleFromParent={this.toggleVoucherModal}
                    idVoucher={this.getIdVoucher}
                    arrVoucher={this.state.arrVoucher}
                />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        dataItemOfCartRedux: state.cart.listCartItem,
        listTypeShips: state.admin.typeShips,
        listVoucherByUserId: state.admin.voucherByUserId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllCartByUserId: (id) => dispatch(actions.fetchAllCartByUserId(id)),
        fetchAllTypeShips: () => dispatch(actions.fetchAllTypeShips()),
        fetchAllVoucherByUserId: (userId) => dispatch(actions.fetchAllVoucherByUserId(userId)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Order));
