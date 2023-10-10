import moment from 'moment';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
class AddressOrder extends Component {

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
        let { dataOrder } = this.props
        return (
            <div className="wrap-address-order">
                <div className="border-top-address-order"></div>
                <div className="wrap-content-address">
                    <div className="content-up">
                        <div className="content-left">
                            <i className="fas fa-map-marker-alt"></i>
                            <span><FormattedMessage id={"manage-order.address-receiver"} /></span>
                        </div>
                    </div>
                    <div className="content-down">
                        {dataOrder && dataOrder.receiverOrderData &&
                            <>
                                <div className="content-left">
                                    <span>{dataOrder.receiverOrderData.name} ({dataOrder.receiverOrderData.phoneNumber})</span>
                                </div>
                                <div className="content-right">
                                    <span>
                                        {dataOrder.receiverOrderData.address}
                                    </span>
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className='pl-3 font-italic'><FormattedMessage id={"order.date"} /> {dataOrder && moment.unix(dataOrder.orderDate / 1000).format('LLLL')} </div>
                {dataOrder && dataOrder.orderDateSuccess &&
                    <div className='pl-3 font-italic'><FormattedMessage id={"order.dateSuccess"} /> {moment.unix(dataOrder.orderDateSuccess / 1000).format('LLLL')}</div>}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddressOrder);
