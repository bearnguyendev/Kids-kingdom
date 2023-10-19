import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
class ItemOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }

    render() {
        let { dataOrder, sumCart, isOrderUser, isExport } = this.props
        return (
            <div className="wrap-order-item">
                <section className="cart_area">
                    <div className="container">
                        <div className="cart_inner">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"><FormattedMessage id={"manage-order.detail-product"} /></th>
                                            <th scope="col"><FormattedMessage id={"manage-order.price-product"} /></th>
                                            <th scope="col"><FormattedMessage id={"manage-order.quantity-product"} /></th>
                                            <th scope="col"><FormattedMessage id={"manage-order.sum-price-product"} /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataOrder.OrderDetailData && dataOrder.OrderDetailData.length > 0 &&
                                            dataOrder.OrderDetailData.map((item, index) => {
                                                console.log("check isExport: ", isExport, item.productImageData[0].image);
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            <div className={isExport ? "cart-detail-product-export" : 'cart-detail-product'} >
                                                                {isExport ?
                                                                    <img src={item.productImageData[0].image}
                                                                        alt="not found"
                                                                        className='cart-image-product-export' />
                                                                    :
                                                                    <div className='cart-image-product'
                                                                        style={{ backgroundImage: `url(${item.productImageData[0].image})` }}
                                                                    >
                                                                    </div>
                                                                }
                                                                <div className='cart-name-product'>
                                                                    {item.name}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{item.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                        <td>{item.OrderDetail.quantity}</td>
                                                        <td>{(item.OrderDetail.quantity * item.discountPrice).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="line-mid">
                        </div>
                        <div className="box-shopcart-bottom" >
                            <div className="content-voucher-left" style={isExport && { visibility: "hidden" }}>
                                <div className="wrap-voucher">
                                    <div className='logo-my-voucher'></div>
                                    <span className="choose-voucher">{dataOrder && dataOrder.voucherData ? dataOrder.voucherData.codeVoucher : isOrderUser && isOrderUser ? <FormattedMessage id={"manage-order.no-voucher-user"} /> : <FormattedMessage id={"manage-order.no-voucher"} />}</span>
                                </div>
                                <div className="wrap-note">
                                    <span><FormattedMessage id={"manage-order.note"} /></span>
                                    {dataOrder.note ? dataOrder.note : isOrderUser && isOrderUser ? <FormattedMessage id={"manage-order.no-note-user"} /> : <FormattedMessage id={"manage-order.no-note"} />}
                                </div>
                            </div>
                            <div className="content-voucher-right">
                                <div className="wrap-price">
                                    <span className="text-total"><FormattedMessage id={"order.sum-cart"} /> ({dataOrder && dataOrder.OrderDetailData && dataOrder.OrderDetailData.length} <FormattedMessage id={"order.product"} />): </span>
                                    <span className="text-price">{sumCart.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemOrder));
