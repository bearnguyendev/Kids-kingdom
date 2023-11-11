import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateStatusOrderService } from '../../services/userService';
import * as actions from "../../store/actions";
class OrderUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            dataOrderView: '',
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.dataChange !== this.props.dataChange) {
            this.setState({
                dataOrderView: this.props.dataChange
            })
        }
    }
    handleCancelOrder = async (data) => {
        try {
            let res = await updateStatusOrderService({
                id: data.id,
                statusId: 'S8',
                dataOrderUser: data
            })
            if (res && res.errCode === 0) {
                toast.success(res.errMessage)
                let { userId } = this.props;
                if (userId) {
                    this.props.getAllOrderByUserIdRedux(userId)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleReceivedOrder = async (data) => {
        try {
            let res = await updateStatusOrderService({
                id: data.id,
                statusId: 'S7',
                dataOrderUser: data
            })
            if (res && res.errCode === 0) {
                toast.success(<FormattedMessage id={"user.received-order"} />)
                let { userId } = this.props;
                if (userId) {
                    this.props.getAllOrderByUserIdRedux(userId)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let { dataChange } = this.props;
        let { dataOrderView, price } = this.state
        console.log("check dataOrderView: ", dataOrderView);
        return (
            <>
                {dataOrderView && dataOrderView.length > 0 && dataOrderView.map((item, index) => {
                    return (
                        <div key={index}>
                            {item.receiverOrderData && item.receiverOrderData.length > 0 &&
                                item.receiverOrderData.map((item1, index1) => {
                                    return (
                                        <div key={index1}>
                                            <div className='box-list-order'>
                                                <div className='content-top-order'>
                                                    <div className='content-left-order'>
                                                        <span className='label-name-shop'><i className="fas fa-store"></i><FormattedMessage id={"user.name-shop"} /></span>
                                                    </div>
                                                    <div className='content-right-order'>
                                                        {item1.statusOrderData && item1.statusOrderData.value}
                                                    </div>
                                                </div>
                                                {item1.OrderDetailData && item1.OrderDetailData.length > 0 &&
                                                    item1.OrderDetailData.map((item2, index2) => {
                                                        return (
                                                            <div className='content-center-order' key={index2}>
                                                                <div className='box-item-order'>
                                                                    <img src={item2.productImageData[0].image}></img>
                                                                    <div className='box-des'>
                                                                        <span className='name'>{item2.name}</span>
                                                                        <span>x{item2.OrderDetail.quantity}</span>
                                                                    </div>
                                                                    <div className='box-price-origin'>{item2.originalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                                                    <div className='box-price-discount'>{item2.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div className='box-price-order'>
                                                <div className='up'>
                                                    <svg width="16" height="17" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M15.94 1.664s.492 5.81-1.35 9.548c0 0-.786 1.42-1.948 2.322 0 0-1.644 1.256-4.642 2.561V0s2.892 1.813 7.94 1.664zm-15.88 0C5.107 1.813 8 0 8 0v16.095c-2.998-1.305-4.642-2.56-4.642-2.56-1.162-.903-1.947-2.323-1.947-2.323C-.432 7.474.059 1.664.059 1.664z" fill="url(#paint0_linear)"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.073 6.905s-1.09-.414-.735-1.293c0 0 .255-.633 1.06-.348l4.84 2.55c.374-2.013.286-4.009.286-4.009-3.514.093-5.527-1.21-5.527-1.21s-2.01 1.306-5.521 1.213c0 0-.06 1.352.127 2.955l5.023 2.59s1.09.42.693 1.213c0 0-.285.572-1.09.28L2.928 8.593c.126.502.285.99.488 1.43 0 0 .456.922 1.233 1.56 0 0 1.264 1.126 3.348 1.941 2.087-.813 3.352-1.963 3.352-1.963.785-.66 1.235-1.556 1.235-1.556a6.99 6.99 0 00.252-.632L8.073 6.905z" fill="#FEFEFE"></path><defs><linearGradient id="paint0_linear" x1="8" y1="0" x2="8" y2="16.095" gradientUnits="userSpaceOnUse"><stop stopColor="#F53D2D"></stop><stop offset="1" stopColor="#F63"></stop></linearGradient></defs></svg>
                                                    <span><FormattedMessage id={"user.total-price"} /></span>
                                                    <span className='name'>{item1.totalPayment && item1.totalPayment > 0 ? (item1.typeShipData.price + item1.totalPayment).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : item1.typeShipData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>
                                                    <div style={{ display: 'none' }}>
                                                        {price}
                                                    </div>
                                                </div>
                                                <div className='down'>
                                                    {((item1.statusId === 'S3') || (item1.statusId === 'S4')) &&

                                                        <div className='btn-buy' onClick={() => this.handleCancelOrder(item1)}>
                                                            <FormattedMessage id={"user.cancel-order"} />
                                                        </div>
                                                    }
                                                    {
                                                        item1.statusId === 'S5' &&
                                                        <div className='btn-buy' onClick={() => this.handleReceivedOrder(item1)} >
                                                            <FormattedMessage id={"user.received"} />
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                        </div>
                    )
                })
                }
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderUser);
