import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageTypeVoucher.scss'
import * as actions from '../../../store/actions';
import { toast } from 'react-toastify';
import { deleteTypeVoucherService } from '../../../services/userService';

class TableManageTypeVoucher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrTypeVouchers: [],
            isOpen: false,
            errMessage: ""
        }
    }

    async componentDidMount() {
        this.props.fetchAllTypeVouchers()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listTypeVouchers !== this.props.listTypeVouchers) {
            this.setState({
                arrTypeVouchers: this.props.listTypeVouchers
            })
        }
    }
    handleDeleteTypeVoucher = async (id) => {
        try {
            let res = await deleteTypeVoucherService(id);
            if (res && res.errCode === 0) {
                toast.success(res.errMessage);
                this.props.fetchAllTypeVouchers();
            } else {
                toast.error("Xoá loại giảm giá thất bại. Vui lòng thử lại sau.")
            }
        } catch (error) {
            toast.error("Thao tác thất bại! Vui lòng thử lại sau.")
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }
    }
    handleEditTypeVoucher = (typeVoucher) => {
        this.props.handleEditTypeVoucherFromParentKey(typeVoucher)
    }
    render() {
        let { arrTypeVouchers } = this.state
        return (
            <>
                <table id='TableManageTypeVoucher'>
                    <thead>
                        <tr>
                            <th className='col-0.5'>STT</th>
                            <th className='col-3'><FormattedMessage id={"manage-type-voucher.type"} /></th>
                            <th className='col-3'><FormattedMessage id={"manage-type-voucher.value"} /></th>
                            <th className='col-3'><FormattedMessage id={"manage-type-voucher.minValue"} /></th>
                            <th className='col-3'><FormattedMessage id={"manage-type-voucher.maxValue"} /></th>
                            <th className='col-2'><FormattedMessage id={"manage-type-voucher.action"} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {arrTypeVouchers && arrTypeVouchers.length > 0 &&
                            arrTypeVouchers.map((item, index) => {
                                return (
                                    <>
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.typeVoucherData.value}</td>
                                            <td>{item.typeVoucherData.value === '%' ? item.value + item.typeVoucherData.value : item.value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                            <td>{item.minValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                            <td>{item.maxValue ? item.maxValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : ''}</td>
                                            <td>
                                                <div className='btn-table-manage-type-voucher'>
                                                    <button
                                                        className='btn-edit'
                                                        onClick={() => this.handleEditTypeVoucher(item)}
                                                        title="Chỉnh sửa"
                                                    ><i className="fas fa-pencil-alt"></i></button>
                                                    <button
                                                        className='btn-delete'
                                                        onClick={() => this.handleDeleteTypeVoucher(item.id)}
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
                {arrTypeVouchers <= 0 &&
                    <div className='text-center mt-3'><FormattedMessage id={"manage-type-voucher.no-data"} /></div>
                }
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listTypeVouchers: state.admin.typeVouchers
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllTypeVouchers: () => dispatch(actions.fetchAllTypeVouchers())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageTypeVoucher);
