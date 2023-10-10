import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import { withRouter } from 'react-router-dom';
import "./OrderUserDetail.scss"
import HeadingOrder from '../../components/Order/HeadingOrder';
import AddressOrder from '../../components/Order/AddressOrder';
import ItemOrder from '../../components/Order/ItemOrder';
import PaymentOrder from '../../components/Order/PaymentOrder';
class OrderUserDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataOrder: [],
            sumCart: 0
        }
    }
    componentDidMount() {
        this.props.hideAvatar()
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
        data && data.length > 0 && data.map(item => sumCart += item.OrderDetail.quantity * item.discountPrice)
        return sumCart;
    }
    render() {
        let { dataOrder, sumCart } = this.state
        return (
            <>
                <div className="wrap-order">
                    <HeadingOrder />
                    <AddressOrder
                        dataOrder={dataOrder}
                    />
                    <ItemOrder
                        dataOrder={dataOrder}
                        sumCart={sumCart}
                        isOrderUser={true}
                    />
                    <PaymentOrder
                        dataOrder={dataOrder}
                        sumCart={sumCart}
                        id={dataOrder.id}
                        fetchDetailOrderById={this.props.fetchDetailOrderById}
                        userId={this.props.userId}
                        isOrderUser={true}
                    />
                </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(OrderUserDetail));
