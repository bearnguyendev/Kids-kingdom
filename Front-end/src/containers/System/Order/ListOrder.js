import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import moment from 'moment';
import { Link } from 'react-router-dom';
import DetailOrderExport from './DetailOrderExport';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import "./DetailOrder.scss"
import HeadingOrder from '../../../components/Order/HeadingOrder';
import AddressOrder from '../../../components/Order/AddressOrder';
import ItemOrder from '../../../components/Order/ItemOrder';
import PaymentOrder from '../../../components/Order/PaymentOrder';
import _ from 'lodash';
class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataOrderUser: []
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    formatData = (data) => {
        data && !_.isEmpty(data) && data.OrderDetailData && data.OrderDetailData.length > 0 && data.OrderDetailData.map(item =>
            item.productImageData[0].image = new Buffer.from(item.productImageData[0].image, 'base64').toString('binary'))
        return data
    }
    setSumCart = (data) => {
        let sumCart = 0
        data && data.length > 0 && data.map(item =>
            sumCart += item.OrderDetail.quantity * item.discountPrice)
        return sumCart;
    }
    render() {
        let { dataOrderUser } = this.props
        let sumCart = dataOrderUser && !_.isEmpty(dataOrderUser) && this.setSumCart(dataOrderUser.OrderDetailData)
        console.log("check data:: ", dataOrderUser, sumCart);
        return (
            <>
                <div className="wrap-order">
                    <HeadingOrder
                        isShowLogo={true}
                    />
                    <AddressOrder
                        dataOrder={dataOrderUser}
                    />
                    <ItemOrder
                        dataOrder={dataOrderUser}
                        sumCart={sumCart}
                        isExport={true}
                    />
                    <PaymentOrder
                        dataOrder={dataOrderUser}
                        sumCart={sumCart}
                        id={dataOrderUser.id}
                        isShowReceiver={true}
                    />
                </div>
                <div style={{ width: '100%', height: '100px', backgroundColor: '#f5f5f5' }}></div>
                {/* <table>
                    <tr>
                        <th>Company</th>
                        <th>Contact</th>
                        <th>Country</th>
                    </tr>
                    <tr>
                        <td>Alfreds Futterkiste</td>
                        <td>Maria Anders</td>
                        <td>Germany</td>
                    </tr>
                    <tr>
                        <td>Centro comercial Moctezuma</td>
                        <td>Francisco Chang</td>
                        <td>Mexico</td>
                    </tr>
                    <tr>
                        <td>Ernst Handel</td>
                        <td>Roland Mendel</td>
                        <td>Austria</td>
                    </tr>
                    <tr>
                        <td>Island Trading</td>
                        <td>Helen Bennett</td>
                        <td>UK</td>
                    </tr>
                    <tr>
                        <td>Laughing Bacchus Winecellars</td>
                        <td>Yoshi Tannamuri</td>
                        <td>Canada</td>
                    </tr>
                    <tr>
                        <td>Magazzini Alimentari Riuniti</td>
                        <td>Giovanni Rovelli</td>
                        <td>Italy</td>
                    </tr>
                </table> */}
            </>
        );
    }
}
class ListOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            text: "old boring text",
        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    handleAfterPrint = () => {
        console.log("`onAfterPrint` called"); // tslint:disable-line no-console
    };

    handleBeforePrint = () => {
        console.log("`onBeforePrint` called"); // tslint:disable-line no-console
    };

    handleOnBeforeGetContent = () => {
        console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
        this.setState({ text: "Loading new text...", isLoading: true });

        return new Promise((resolve) => {
            setTimeout(() => {
                this.setState(
                    { text: "New, Updated Text!", isLoading: false },
                    resolve
                );
            }, 2000);
        });
    };

    setComponentRef = (ref) => {
        this.componentRef = ref;
    };

    reactToPrintContent = () => {
        return this.componentRef;
    };

    reactToPrintTrigger = () => {
        // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
        // to the root node of the returned component as it will be overwritten.

        // Bad: the `onClick` here will be overwritten by `react-to-print`
        // return <button onClick={() => alert('This will not work')}>Print this out!</button>;

        // Good
        return <button>Print using a Class</button>;
    };

    render() {
        let { arrOrder } = this.props
        console.log("check arrOrder: ", arrOrder);
        return (
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover" style={{ border: '1' }} width="100%" cellspacing="0">
                        <thead>
                            <tr className='table-primary'>
                                <th><FormattedMessage id={"manage-order.id-order"} /></th>
                                <th><FormattedMessage id={"manage-order.date"} /></th>
                                <th><FormattedMessage id={"manage-order.date-success"} /></th>
                                <th><FormattedMessage id={"manage-order.type-ship"} /></th>
                                <th><FormattedMessage id={"manage-order.voucher"} /></th>
                                <th><FormattedMessage id={"manage-order.sum-bill"} /></th>
                                <th><FormattedMessage id={"manage-order.status"} /></th>
                                <th><FormattedMessage id={"manage-order.payment"} /></th>
                                <th><FormattedMessage id={"manage-order.action"} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {arrOrder && arrOrder.length > 0 &&
                                arrOrder.map((item, index) => {
                                    let date = moment.unix(item.orderDate / 1000).format('DD/MM/YYYY')
                                    let dateSuccess = moment.unix(item.orderDateSuccess / 1000).format('DD/MM/YYYY')
                                    return (
                                        <tr key={index}>
                                            <td>{item.id}</td>
                                            <td>{date}</td>
                                            <td>{item.orderDateSuccess ? dateSuccess : "Đơn hàng chưa có ngày hoàn thành"}</td>
                                            <td>{item.typeShipData.type && item.typeShipData.type}</td>
                                            <td>{item.voucherData && item.voucherData.codeVoucher ? item.voucherData.codeVoucher : "Không sử dụng mã giảm giá"}</td>
                                            <td>{item.totalPayment > 0 ? (item.totalPayment + item.typeShipData.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : item.typeShipData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                            <td><FormattedMessage id={item.isPaymentOnl === 1 ? "order.paid" : "order.unpaid"} /></td>
                                            <td>{item.statusOrderData.value}</td>
                                            <td>
                                                <Link to={`/admin/order-detail/${item.id}`}><FormattedMessage id={"manage-order.view"} /></Link>
                                                {/* <ReactToPrint
                                                    trigger={() => <button>Print this out!</button>}
                                                    content={() => this.componentRef}
                                                    onAfterPrint={this.handleAfterPrint}
                                                    onBeforeGetContent={this.handleOnBeforeGetContent}
                                                    onBeforePrint={this.handleBeforePrint}
                                                    removeAfterPrint
                                                />
                                                {this.state.isLoading && (
                                                    <p className="indicator">onBeforeGetContent: Loading...</p>
                                                )}
                                                <div style={{ display: "none" }}>
                                                    <DetailOrderExport
                                                        dataOrderUser={item}
                                                        ref={el => {
                                                            console.log("check el", el);
                                                            return this.componentRef = el
                                                        }}
                                                    />
                                                </div> */}
                                                {/* <ReactToPrint
                                                    trigger={() => {
                                                        return <button>In</button>
                                                    }}
                                                    content={() => this.componentRef}
                                                    documentTitle={`Đơn hàng-${item.id}-${new Date().getTime()}`}
                                                    pageStyle="print"
                                                />
                                                <DetailOrderExport id={item.id} ref={el => (this.componentRef = el)} /> */}
                                                {/* <ReactToPrint
                                                    content={this.reactToPrintContent}
                                                    documentTitle="AwesomeFileName"
                                                    onAfterPrint={this.handleAfterPrint}
                                                    onBeforeGetContent={this.handleOnBeforeGetContent}
                                                    onBeforePrint={this.handleBeforePrint}
                                                    removeAfterPrint
                                                    trigger={this.reactToPrintTrigger}
                                                />
                                                {this.state.isLoading && (
                                                    <p className="indicator">onBeforeGetContent: Loading...</p>
                                                )}
                                                <DetailOrderExport
                                                    ref={this.setComponentRef}
                                                    id={item.id}
                                                /> */}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    {arrOrder <= 0 &&
                        <div className='text-center'>
                            <FormattedMessage id={"manage-order.no-data"} />
                        </div>
                    }
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
export default connect(mapStateToProps, mapDispatchToProps)(ListOrder);
