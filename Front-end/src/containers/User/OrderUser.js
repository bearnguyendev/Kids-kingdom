import _ from 'lodash';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateStatusOrderService } from '../../services/userService';
import * as actions from "../../store/actions";
import ViewOrderByStatus from './ViewOrderByStatus';
import { emitter } from '../../utils/emitter';
class OrderUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataOrder: '',
            price: 0,
            dataChange: '',
            isOpenModalComment: false
        }
    }
    async componentDidMount() {
        this.props.hideAvatar()
        window.scrollTo(0, 0)
        let { userId } = this.props;
        if (userId) {
            await this.props.getAllOrderByUserIdRedux(userId)
        }
        this.props.fetchAllcodeStatusOrder()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.ordersOfUserRedux !== this.props.ordersOfUserRedux) {
            this.setState({
                dataOrder: this.props.ordersOfUserRedux
            })
        }
        if (prevProps.statusOrder !== this.props.statusOrder) {
            this.setState({
                arrStatusOrder: this.props.statusOrder
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
                toast.success("Đã nhận đơn hàng")
                let { userId } = this.props;
                if (userId) {
                    this.props.getAllOrderByUserIdRedux(userId)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleOnchangeStatus = async (event) => {
        let { dataOrder, dataChange } = this.state;
        if (event.target.value === 'ALL') {
            this.setState({
                dataChange: dataOrder
            })
        } else {
            if (dataOrder && dataOrder.length > 0) {
                let arrTemp = [];

                // arrTemp = dataOrder.map(item => item.receiverOrderData && item.receiverOrderData.length > 0
                //     && item.receiverOrderData.filter(item1 => item1.statusId === event.target.value)
                // )
                // dataChange = dataChange.filter(item => item !== false)
                // this.setState({
                //     dataChange: arrTemp
                // })

            } else {
                return (
                    <>
                        <div>Không có đơn hàng nào thuộc danh mục bạn chọn!</div>
                    </>
                )
            }
        }
    }
    handleCmtOrder = () => {
        this.setState({
            isOpenModalComment: true
        })
    }
    toggleCommentModal = () => {
        this.setState({
            isOpenModalComment: !this.state.isOpenModalComment
        })
    }

    render() {
        let { dataOrder, price, dataChange, arrStatusOrder } = this.state
        console.log("check dataa: ", dataOrder);
        return (
            <div className="order-user">
                {/* <select onChange={(event) => this.handleOnchangeStatus(event)} className="form-control col-6 ml-3 mt-3 form-control-lg">
                    <option value={'ALL'} selected>Tất cả trạng thái đơn hàng</option>
                    {
                        arrStatusOrder && arrStatusOrder.length > 0 &&
                        arrStatusOrder.map((item, index) => {
                            return (
                                <option value={item.keyMap}>{item.value}</option>
                            )
                        })
                    }
                </select> */}
                {/* <div className='title-order-user'>
                    <a className='nav-item-order active' onClick={() => this.handleClickView('ALL')}>
                        <span>Tất cả</span>
                    </a>
                    <a className='nav-item-order' onClick={() => this.handleClickView('S3')}>
                        <span>Chờ xác nhận</span>
                    </a>
                    <a className='nav-item-order' onClick={() => this.handleClickView('S4')}>
                        <span>Chờ lấy hàng</span>
                    </a>
                    <a className='nav-item-order' onClick={() => this.handleClickView('S5')}>
                        <span>Đang giao</span>
                    </a>
                    <a className='nav-item-order' onClick={() => this.handleClickView('S6')}>
                        <span>Đã giao</span>
                    </a>
                    <a className='nav-item-order' onClick={() => this.handleClickView('S7')}>
                        <span>Đã hủy</span>
                    </a>
                </div> */}
                {/* <ViewOrderByStatus
                    dataChange={dataChange}
                /> */}
                {/* <div className='box-search-order'>
                    <i className="fas fa-search"></i>
                    <input autoComplete='off' placeholder='Tìm kiếm theo Tên Shop, ID đơn hàng hoặc Tên Sản phẩm' type={"text"} />
                </div> */}

                {dataOrder && dataOrder.length > 0 ?
                    dataOrder.map((item, index) => {
                        return (
                            <div key={index}>
                                {item.receiverOrderData && item.receiverOrderData.length > 0 &&
                                    item.receiverOrderData.map((item1, index1) => {
                                        console.log(item);
                                        return (
                                            <div key={index1}>
                                                <div className='box-list-order'>
                                                    <div className='content-top-order'>
                                                        <div className='content-left-order'>
                                                            <span className='label-name-shop'><i className="fas fa-store"></i>{' '}<FormattedMessage id={"user.name-shop"} /></span>
                                                            <Link to={`/user/detail-order/${item1.id}`}><FormattedMessage id={"user.detail-order"} /></Link>
                                                        </div>
                                                        <div className={item1.statusOrderData && item1.statusOrderData.keyMap === "S8" ? "text-danger" : 'content-right-order'} >
                                                            {item1.statusOrderData && item1.statusOrderData.value} {item1.isPaymentOnl === 1 && ' | Đã thanh toán'}
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
                                                <div className='box-price-order'
                                                    style={item1.statusId === "S7" ? { justifyContent: "space-between" } : { justifyContent: "flex-end" }}
                                                >
                                                    {/* {item1.statusId === "S7" &&
                                                        <div className='content-cmt'>
                                                            <button type="button" className="btn btn btn-warning px-3"
                                                            >
                                                                <Link to={`/user/review-order/${item1.id}&${this.props.userId}`} style={{ textDecoration: "none" }}>Đánh giá sản phẩm</Link>

                                                            </button>
                                                        </div>} */}
                                                    <div className='price-status'>
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

                                                                <div className='btn-buy btn-cancel' onClick={() => this.handleCancelOrder(item1)}>
                                                                    <FormattedMessage id={"user.cancel-order"} />
                                                                </div>
                                                            }
                                                            {
                                                                item1.statusId === 'S6' &&
                                                                <div className='btn-buy' onClick={() => this.handleReceivedOrder(item1)} >
                                                                    <FormattedMessage id={"user.received"} />
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                            </div>
                        )
                    })
                    :
                    <div className='text-center'><FormattedMessage id={"user.no-data-order"} /></div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ordersOfUserRedux: state.admin.ordersOfUser,
        statusOrder: state.admin.statusOrder,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllOrderByUserIdRedux: (userId) => dispatch(actions.fetchAllOrderByUserId(userId)),
        fetchAllcodeStatusOrder: () => dispatch(actions.fetchAllcodeStatusOrder()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderUser);
