import React, { Component } from 'react';
import * as actions from "../../../store/actions";
import "./DetailOrder.scss"
import AddressOrder from '../../../components/Order/AddressOrder';
import ItemOrder from '../../../components/Order/ItemOrder';
import HeadingOrderExport from '../../../components/Order/HeadingOrderExport';
import PaymentOrderExport from '../../../components/Order/PaymentOrderExport';
import HeadingOrder from '../../../components/Order/HeadingOrder';
class DetailOrderExport extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    // setSumCart = (data) => {
    //     let sumCart = 0
    //     data && data.length > 0 && data.map(item =>
    //         sumCart += item.OrderDetail.quantity * item.discountPrice)
    //     return sumCart;
    // }
    render() {
        let { dataOrderUser, sumCart } = this.props
        // let sumCart = dataOrderUser && !_.isEmpty(dataOrderUser) && this.setSumCart(dataOrderUser.OrderDetailData)
        console.log("check data:: ", dataOrderUser);
        return (
            <>
                <div className="wrap-order">
                    <HeadingOrderExport
                    />
                    <AddressOrder
                        dataOrder={dataOrderUser}
                    />
                    <ItemOrder
                        dataOrder={dataOrderUser}
                        sumCart={sumCart}
                        isExport={true}
                    />
                    <PaymentOrderExport
                        dataOrder={dataOrderUser}
                        sumCart={sumCart}
                        id={dataOrderUser.id}
                    />
                </div>
            </>
        );
    }

}

export default DetailOrderExport;
