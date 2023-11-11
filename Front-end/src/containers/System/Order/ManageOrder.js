import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import ListOrder from './ListOrder';
import { CommonUtils } from '../../../utils';
import moment from 'moment';
import { toast } from 'react-toastify';
class ManageOrder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrStatusOrder: [],
            dataOrder: [],
            dataExport: []
        }
    }
    componentDidMount() {
        this.props.fetchAllcodeStatusOrder()
        this.props.fetchAllOrders('ALL')
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.statusOrder !== this.props.statusOrder) {
            this.setState({
                arrStatusOrder: this.props.statusOrder
            })
        }
        if (prevProps.orderRedux !== this.props.orderRedux) {
            let result = this.buildDataExport(this.props.orderRedux)
            this.setState({
                dataOrder: this.props.orderRedux,
                dataExport: result
            })
        }
    }
    handleOnchangeStatus = (event) => {
        this.props.fetchAllOrders(event.target.value)
    }
    buildDataExport = (data) => {
        let result = data && data.length > 0 && data.map(item => ({
            Id: item.id,
            OrderDate: moment.unix(item.orderDate / 1000).format('DD/MM/YYYY'),
            OrderDateSuccess: item.orderDateSuccess ? moment.unix(item.orderDateSuccess / 1000).format('DD/MM/YYYY') : 'Đơn hàng chưa có ngày hoàn thành',
            TypeShip: item.typeShipData.type,
            Voucher: item.voucherData ? item.voucherData.codeVoucher : <FormattedMessage id={"order.no-voucher"} />,
            OrderAddress: item.receiverOrderData.address,
            Status: item.statusOrderData.value,
            Payment: <FormattedMessage id={item.isPaymentOnl === 1 ? "order.paid" : "order.unpaid"} />,
            TotalPayment: item.totalPayment > 0 ? (item.totalPayment + item.typeShipData.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : item.typeShipData.price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
        }))
        return result
    }
    handleExportExcel = async () => {

        let { dataExport } = this.state
        if (!dataExport) {
            toast.error(<FormattedMessage id={"manage-order.no-data-export-excel"} />)
        } else {
            let nameFile = `ListOrder-${new Date().getTime()}`
            await CommonUtils.exportExcel(dataExport, "Danh sách đặt hàng", nameFile)
        }
    }
    render() {
        let { arrStatusOrder } = this.state
        return (
            <div className='manage-order-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-order.title"} />
                </div>
                <div className='manage-order-body'>
                    <div className='container'>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                <FormattedMessage id={"manage-order.list-order"} />
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <select onChange={(event) => this.handleOnchangeStatus(event)} className="form-control col-3 ml-3 mt-3 form-control-lg">
                                    <option value={'ALL'} selected>Tất cả trạng thái đơn hàng</option>
                                    {
                                        arrStatusOrder && arrStatusOrder.length > 0 &&
                                        arrStatusOrder.map((item, index) => {
                                            return (
                                                <option value={item.keyMap}>{item.value}</option>
                                            )
                                        })
                                    }
                                </select>
                                <div className='col-3' >
                                    <button className='btn btn-success btn-lg'
                                        style={{ float: "right", width: "11rem", height: "3rem" }}
                                        onClick={() => this.handleExportExcel()}
                                    >
                                        Xuất
                                        &nbsp;
                                        <i style={{ fontSize: "18px" }} className="fas fa-file-excel"></i>
                                    </button>
                                </div>
                            </div>
                            <ListOrder
                                arrOrder={this.state.dataOrder}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        orderRedux: state.admin.orders,
        statusOrder: state.admin.statusOrder,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeStatusOrder: () => dispatch(actions.fetchAllcodeStatusOrder()),
        fetchAllOrders: (statusId) => dispatch(actions.fetchAllOrders(statusId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageOrder);
