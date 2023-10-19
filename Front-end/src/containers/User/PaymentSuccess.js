import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { paymentPayPalSuccessService, createNewOrderService } from '../../services/userService';
import * as actions from "../../store/actions";
import HomeFooter from '../HomePage/HomeFooter';
import HomeNav from '../HomePage/HomeNav';
import "./ActiveEmail.scss"
class ActiveEmail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusPayment: false,
            errCode: 0
        }
    }
    async componentDidMount() {
        let userId = this.props.userInfo.id
        if (userId) {
            await this.props.fetchAllCartByUserId(userId)
        }
        let { location } = this.props
        if (location && location.search) {
            let urlParams = new URLSearchParams(location.search)
            let PayerID = urlParams.get('PayerID');
            let paymentId = urlParams.get('paymentId');
            let token = urlParams.get('token');
            let message = urlParams.get('message');
            let requestIdMomo = urlParams.get('requestId');
            // if (dataItemOfCartRedux.ProductUserCartData.length > 0) {
            //     let result = [];
            //     dataItemOfCartRedux.ProductUserCartData.map((item, index) => {
            //         let object = {};
            //         object.productId = item.Cart.productId
            //         object.quantity = item.Cart.quantity
            //         object.realPrice = item.discountPrice
            //         result.push(object)
            //     })
            //     let orderData = {
            //         orderDate: Date.now(),
            //         receiverId: receiverId,
            //         typeShipId: selectedTypeShip.id,
            //         voucherId: selectedVoucher.id,
            //         note: note,
            //         //totalPayment: totalPriceDiscount > 0 ? totalPriceDiscount + selectedTypeShip.price : selectedTypeShip.price,
            //         totalPayment: totalPriceDiscount,
            //         userId: userId,
            //         arrDataCart: result
            //     }
            // }
            let orderData = JSON.parse(localStorage.getItem("orderData"))
            let totalUSD = orderData.totalPaymentUSD
            let { requestId } = orderData
            delete orderData.totalPaymentUSD
            delete orderData.requestId
            localStorage.removeItem("orderData")
            var res = ''
            if (message && message === "Success" && requestId && requestId === requestIdMomo) {
                res = await createNewOrderService(orderData)
            } else {
                res = await paymentPayPalSuccessService({
                    PayerID,
                    paymentId,
                    token,
                    orderData,
                    totalUSD
                })
            }
            if (res && res.errCode === 0) {
                this.setState({
                    statusPayment: true,
                    errCode: res.errCode
                })
                await this.props.fetchAllCartByUserId(userId)
                setTimeout(() => {
                    this.props.history.push(`/user/order/${userId}`)
                }, 4000)
            } else {
                this.setState({
                    statusPayment: true,
                    errCode: res && res.errCode ? res.errCode : -1
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let { statusPayment, errCode } = this.state
        return (
            <>
                <HomeNav />
                <div className='container'>
                    {/* <>accessKey=F8BBA842ECF85&amount=1000&
                    errorCode=0&extraData=&
                    localMessage=Thành%20công&
                    message=Success&
                    orderId=1asdxx1696811392365&
                    orderInfo=Thanh%20toán%20đơn%20hàng&
                    orderType=momo_wallet&
                    partnerCode=MOMO&
                    payType=web&
                    requestId=ID-1asdxx&
                    responseTime=2023-10-09%2007%3A30%3A27&
                    signature=f20892370ae0535b25567194426a5dbcd832fb5afe397cc75b1f9cce919cc12a&
                    transId=3106558685</> */}
                    <div className='verify-email-container'>
                        {statusPayment === false ?
                            <div>
                                <FormattedMessage id={"order.payment-status.loading-data"} />
                            </div>
                            :
                            <div>
                                {errCode === 0 ?
                                    <div className='user-active-email active'>
                                        <FormattedMessage id={"order.payment-status.success"} />
                                    </div>
                                    :
                                    <div className='user-active-email inactive'>
                                        <FormattedMessage id={"order.payment-status.error"} />
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
                <HomeFooter />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        dataItemOfCartRedux: state.cart.listCartItem,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateUserInfoRedux: (userInfo) => dispatch(actions.updateUserInfo(userInfo)),
        fetchAllCartByUserId: (id) => dispatch(actions.fetchAllCartByUserId(id))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveEmail);
