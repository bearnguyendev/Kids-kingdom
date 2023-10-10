import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
class PaymentOrderExport extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

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
                    <div className='box-type-payment active'><FormattedMessage id={"order.ship-cod"} /></div>

                </div>
                <div className="content-top">
                    <span><FormattedMessage id={"order.status"} /></span>
                    {dataOrder.statusOrderData &&
                        <div className={dataOrder.statusOrderData.keyMap === 'S8' ? 'box-type-payment cancel' : 'box-type-payment active'}>{dataOrder.statusOrderData.value}</div>
                    }
                </div>
                <div className="content-bottom" >
                    {dataOrder && dataOrder.receiverOrderData &&
                        <div className="wrap-bottom">
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

export default connect(mapStateToProps, mapDispatchToProps)(PaymentOrderExport);
