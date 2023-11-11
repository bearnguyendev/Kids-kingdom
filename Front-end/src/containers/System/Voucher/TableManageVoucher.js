import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageVoucher.scss'
import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';
import { deleteVoucherService } from '../../../services/userService';
import moment from 'moment';
import localization from 'moment/locale/vi'
class TableManageVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrVouchers: [],
            isOpen: false,
            errMessage: ""
        }
    }

    async componentDidMount() {
        this.props.fetchAllVouchers()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listVouchers !== this.props.listVouchers) {
            this.setState({
                arrVouchers: this.props.listVouchers
            })
        }
    }
    handleDeleteVoucher = async (id) => {
        try {
            let res = await deleteVoucherService(id);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllVouchers();
            } else {
                toast.error(res.errMessage)
            }
        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }
    handleEditVoucher = (typeVoucher) => {
        this.props.handleEditVoucherFromParentKey(typeVoucher)
    }
    render() {
        let { arrVouchers } = this.state;
        console.log("check stateaaa: ", arrVouchers);
        return (
            <>
                <table id='TableManageVoucher'>
                    <thead>
                        <tr>
                            <th className='col-0.5'>STT</th>
                            <th className='col-2'><FormattedMessage id={"manage-voucher.codeVoucher"} /></th>
                            <th className='col-2'><FormattedMessage id={"manage-voucher.typeVoucherId"} /></th>
                            <th className='col-1'><FormattedMessage id={"manage-voucher.number"} /></th>
                            <th className='col-1.5'><FormattedMessage id={"manage-voucher.numberUsed"} /></th>
                            <th className='col-1.5'><FormattedMessage id={"manage-voucher.fromDate"} /></th>
                            <th className='col-1.5'><FormattedMessage id={"manage-voucher.toDate"} /></th>
                            <th className='col-2'><FormattedMessage id={"manage-voucher.action"} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrVouchers && arrVouchers.length > 0 &&
                            arrVouchers.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.codeVoucher}</td>
                                            <td>{item.typeVoucherOfVoucherData.type === 'percent' ? item.typeVoucherOfVoucherData.value + "%" : item.typeVoucherOfVoucherData.value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                            <td>{item.number}</td>
                                            <td>{item.numberUsed}</td>
                                            <td>{moment.unix(item.fromDate / 1000).format('L')}</td>
                                            <td>{moment.unix(item.toDate / 1000).format('L')}</td>
                                            <td>
                                                <div className='btn-table-manage-voucher'>
                                                    <button
                                                        className='btn-edit'
                                                        onClick={() => this.handleEditVoucher(item)}
                                                        title="Chỉnh sửa"
                                                    ><i className="fas fa-pencil-alt"></i></button>
                                                    <button
                                                        className='btn-delete'
                                                        onClick={() => this.handleDeleteVoucher(item.id)}
                                                        title="Xoá"
                                                    ><i className="fas fa-trash"></i></button>
                                                </div>

                                            </td>
                                        </tr>
                                    </>
                                )
                            })}
                    </tbody>
                </table>
                {arrVouchers <= 0 &&
                    <div className='text-center mt-3'><FormattedMessage id={"manage-voucher.no-data"} /></div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listVouchers: state.admin.vouchers,
        listTypeVoucher: state.admin.typeVouchers
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllVouchers: () => dispatch(actions.fetchAllVouchers()),
        fetchAllTypeVouchers: () => dispatch(actions.fetchAllTypeVouchers())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageVoucher);
