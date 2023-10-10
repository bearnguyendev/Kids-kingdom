import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import { withRouter } from 'react-router-dom';
import "./DetailOrder.scss"
import HeadingOrder from '../../../components/Order/HeadingOrder';
import AddressOrder from '../../../components/Order/AddressOrder';
import ItemOrder from '../../../components/Order/ItemOrder';
import PaymentOrder from '../../../components/Order/PaymentOrder';
import ReactToPrint from 'react-to-print';
import DetailOrderExport from './DetailOrderExport';
class DetailOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataOrder: [],
            sumCart: 0,
            isLoading: false
        }
    }
    componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let orderId = this.props.match.params.id
            this.props.fetchDetailOrderById(orderId)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataOrderRedux !== this.props.dataOrderRedux) {
            let sumCart = this.setSumCart(this.props.dataOrderRedux.OrderDetailData)
            this.setState({
                dataOrder: this.props.dataOrderRedux,
                sumCart
            })
        }
    }
    setSumCart = (data) => {
        let sumCart = 0
        data && data.length > 0 && data.map(item =>
            sumCart += item.OrderDetail.quantity * item.discountPrice)
        return sumCart;
    }
    render() {
        let { dataOrder, sumCart } = this.state
        return (
            <>

                <div className="wrap-order mb-2">
                    <HeadingOrder
                        isShowLogo={true}
                    />
                    <AddressOrder
                        dataOrder={dataOrder}
                    />
                    <ItemOrder
                        dataOrder={dataOrder}
                        sumCart={sumCart}
                    />
                    <PaymentOrder
                        dataOrder={dataOrder}
                        sumCart={sumCart}
                        id={dataOrder.id}
                        fetchDetailOrderById={this.props.fetchDetailOrderById}
                        isShowReceiver={true}
                    />
                </div>
                {dataOrder && dataOrder.statusId === "S7" &&
                    <>
                        <ReactToPrint
                            trigger={() => <div className='text-center'><button type="button" className="btn btn-outline-primary px-3">In đơn hàng</button></div>}
                            content={() => this.componentRef}
                            documentTitle={`Đơn hàng-${dataOrder.id}-${new Date().getTime()}`}
                            pageStyle="print"
                        />
                        <div style={{ display: "none" }}>
                            <DetailOrderExport
                                dataOrderUser={dataOrder}
                                sumCart={sumCart}
                                ref={el => this.componentRef = el}
                            />
                        </div></>
                }
                <div style={{ width: '100%', height: '100px', backgroundColor: '#f5f5f5' }}></div>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        dataOrderRedux: state.admin.orderById
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchDetailOrderById: (id) => dispatch(actions.fetchDetailOrderById(id))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailOrder));
