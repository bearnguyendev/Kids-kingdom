import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { toast } from 'react-toastify';
import { updateStatusOrderService } from '../../services/userService';
class PaymentOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    handleAcceptOrder = async () => {
        let res = await updateStatusOrderService({
            id: this.props.id,
            statusId: 'S4'
        })
        if (res && res.errCode === 0) {
            toast.success(<FormattedMessage id={"order.accept-order"} />)
            let orderId = this.props.id && this.props.id
            this.props.fetchDetailOrderById(orderId)
        }
    }
    handleWaitProduct = async () => {
        let res = await updateStatusOrderService({
            id: this.props.id,
            statusId: 'S5'
        })
        if (res && res.errCode === 0) {
            toast.success(<FormattedMessage id={"order.get-products"} />)
            let orderId = this.props.id && this.props.id
            this.props.fetchDetailOrderById(orderId)
        }
    }
    handleSendProduct = async () => {
        let res = await updateStatusOrderService({
            id: this.props.id,
            statusId: 'S6'
        })
        if (res && res.errCode === 0) {
            toast.success(<FormattedMessage id={"order.send-product"} />)
            let orderId = this.props.id && this.props.id
            this.props.fetchDetailOrderById(orderId)
        }
    }
    handleSuccessShip = async (data) => {
        let res = await updateStatusOrderService({
            id: this.props.id,
            statusId: 'S7',
            dataOrderUser: data,
            orderDateSuccess: Date.now()
        })
        if (res && res.errCode === 0) {
            toast.success(<FormattedMessage id={"order.success-ship"} />)
            let orderId = this.props.id && this.props.id
            this.props.fetchDetailOrderById(orderId)
        }
    }
    handleCancelOrder = async (data) => {
        try {
            let res = await updateStatusOrderService({
                id: this.props.id,
                statusId: 'S8',
                dataOrderUser: data
            })
            if (res && res.errCode === 0) {
                toast.success(<FormattedMessage id={"order.cancel"} />)
                let orderId = this.props.id && this.props.id
                this.props.fetchDetailOrderById(orderId)
                setTimeout(() => {
                    if (this.props.history) {
                        this.props.isOrderUser ? this.props.history.push(`/user/order/${this.props.userId}`) : this.props.history.push(`/admin/manage-order`)
                    }
                }, 3000);
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let { dataOrder, sumCart, isShowReceiver, isOrderUser } = this.props
        return (
            <div className="wrap-payment">
                <div className="content-top">
                    <span><FormattedMessage id={"order.type-ship"} /></span>
                    {dataOrder && dataOrder.typeShipData &&
                        <div className='box-type-payment active'>{dataOrder.typeShipData.type} - {dataOrder.typeShipData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                    }
                </div>
                <div className="content-top">
                    <span><FormattedMessage id={"order.type-payment"} /></span>
                    <div className='box-type-payment active'>{dataOrder.isPaymentOnl === 0 ? <FormattedMessage id={"order.ship-cod"} /> : <FormattedMessage id={"order.payment-onl"} />} </div>

                </div>
                <div className="content-top">
                    <span><FormattedMessage id={"order.status"} /></span>
                    {dataOrder.statusOrderData &&
                        <div className={dataOrder.statusOrderData.keyMap === 'S8' ? 'box-type-payment cancel' : 'box-type-payment active'}>{dataOrder.statusOrderData.value}</div>
                    }

                </div>
                <div className="content-bottom" >
                    {dataOrder && dataOrder.receiverOrderData &&
                        <div className="wrap-bottom" style={isShowReceiver ? { visibility: 'visible' } : { visibility: 'hidden' }}>
                            <div className="box-flex">
                                <div className="head"><FormattedMessage id={"order.name"} /></div>
                                <div >{dataOrder.receiverOrderData.userData.lastName}{' '}{dataOrder.receiverOrderData.userData.firstName}</div>
                            </div>
                            <div className="box-flex">
                                <div className="head"><FormattedMessage id={"order.email"} /></div>
                                <div >{dataOrder.receiverOrderData.userData.email}</div>
                            </div>
                            <div className="box-flex">
                                <div className="head"><FormattedMessage id={"order.phone-number"} /></div>
                                <div >{dataOrder.receiverOrderData.userData.phoneNumber}</div>
                            </div>
                        </div>
                    }

                    <div className="wrap-bottom">
                        <div className="box-flex">
                            <div className="head"><FormattedMessage id={"order.sum-cart"} />:</div>
                            <div >{sumCart.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                        </div>
                        <div className="box-flex">
                            <div className="head"><FormattedMessage id={"order.sum-voucher"} /></div>
                            <div >{dataOrder && dataOrder.voucherData ? (sumCart - dataOrder.totalPayment).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : 0 + ' VND'}</div>
                        </div>
                        <div className="box-flex">
                            <div className="head"><FormattedMessage id={"order.price-ship"} /></div>
                            <div >{dataOrder && dataOrder.typeShipData && dataOrder.typeShipData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                        </div>

                        <div className="box-flex">
                            <div className="head"><FormattedMessage id={"order.sum-bill"} /></div>
                            <div className="money">{dataOrder && dataOrder.typeShipData && dataOrder.totalPayment > 0 ? (dataOrder.typeShipData.price + dataOrder.totalPayment).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : dataOrder && dataOrder.typeShipData && dataOrder.typeShipData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                        </div>
                        {isOrderUser ?
                            <div className="box-flex box-btn-action">
                                {dataOrder && dataOrder.statusId === 'S3' &&
                                    <a onClick={() => this.handleCancelOrder(dataOrder)} className="main_btn btn-cancel"><FormattedMessage id={"order.cancel-order"} /></a>
                                }
                                {dataOrder && dataOrder.statusId === 'S4' &&
                                    <a onClick={() => this.handleCancelOrder(dataOrder)} className="main_btn btn-cancel"><FormattedMessage id={"order.cancel-order"} /></a>
                                }
                                {dataOrder && dataOrder.statusId === 'S6' &&
                                    <a onClick={() => this.handleSuccessShip(dataOrder)} className="main_btn"><FormattedMessage id={"order.received-user"} /></a>
                                }
                            </div>
                            :
                            <div className="box-flex box-btn-action">
                                {dataOrder && dataOrder.statusId === 'S3' &&
                                    <a onClick={() => this.handleAcceptOrder()} className="main_btn"><FormattedMessage id={"order.accept"} /></a>
                                }
                                {dataOrder && dataOrder.statusId === 'S4' &&
                                    <a onClick={() => this.handleWaitProduct()} className="main_btn"><FormattedMessage id={"order.get-product"} /></a>
                                }
                                {dataOrder && dataOrder.statusId === 'S5' &&
                                    <a onClick={() => this.handleSendProduct()} className="main_btn"><FormattedMessage id={"order.delivery"} /></a>
                                }
                                {dataOrder && dataOrder.statusId === 'S6' &&
                                    <a onClick={() => this.handleSuccessShip(dataOrder)} className="main_btn"><FormattedMessage id={"order.received"} /></a>
                                }
                                {dataOrder && dataOrder.statusId === 'S3' &&
                                    <a onClick={() => this.handleCancelOrder(dataOrder)} className="main_btn btn-cancel"><FormattedMessage id={"order.cancel-order"} /></a>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PaymentOrder));
