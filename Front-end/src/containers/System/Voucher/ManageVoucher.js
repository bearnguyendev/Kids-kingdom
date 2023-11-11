import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { createNewVoucherService, editVoucherService } from '../../../services/userService';
import TableManageVoucher from "./TableManageVoucher";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
import DatePicker from "../../../components/Input/DatePicker";
import moment from 'moment';
import localization from 'moment/locale/vi'
class ManageVoucher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            typeVoucherId: '',
            arrTypeVoucher: '',
            fromDate: '',
            toDate: '',
            oldFromDate: '',
            oldToDate: '',
            isChangeFromDate: false,
            isChangeToDate: false,
            number: '',
            codeVoucher: '',
            action: '',
            id: '',
            errMessage: ""
        }
    }
    componentDidMount() {
        this.props.fetchAllVouchers()
        this.props.fetchAllTypeVouchers()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.number !== this.state.number) {
            if (this.state.number < 0) {
                this.setState({
                    number: 1
                })
            } else if (this.state.number == 0) {
                this.setState({
                    number: ""
                })
            }
        }
        if (prevProps.listVouchers !== this.props.listVouchers) {
            let typeVoucherArr = this.props.listTypeVoucher
            this.setState({
                number: '',
                fromDate: '',
                toDate: '',
                codeVoucher: '',
                isChangeFromDate: false,
                isChangeToDate: false,
                typeVoucherId: typeVoucherArr && typeVoucherArr.length > 0 ? typeVoucherArr[0].id : '',
                action: CRUD_ACTIONS.CREATE
            })
        }
        if (prevProps.listTypeVoucher !== this.props.listTypeVoucher) {
            let typeVoucherArr = this.props.listTypeVoucher
            this.setState({
                arrTypeVoucher: typeVoucherArr,
                typeVoucherId: typeVoucherArr && typeVoucherArr.length > 0 ? typeVoucherArr[0].id : ''
            })
        }
    }
    handleSaveUser = async () => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === false) {
                return;
            }
            let { action, toDate, fromDate, number, typeVoucherId, codeVoucher, id, oldFromDate, oldToDate, isChangeFromDate, isChangeToDate } = this.state
            let fromDateTimestamp = new Date(fromDate).getTime()
            let toDateTimestamp = new Date(toDate).getTime()
            if (action === CRUD_ACTIONS.CREATE) {
                let res = await createNewVoucherService({
                    typeVoucherId: typeVoucherId,
                    number: number,
                    fromDate: fromDateTimestamp,
                    toDate: toDateTimestamp,
                    codeVoucher: codeVoucher
                })
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage);
                    this.props.fetchAllVouchers();
                } else {
                    toast.error(res.errMessage)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                let res = await editVoucherService({
                    typeVoucherId: typeVoucherId,
                    number: number,
                    fromDate: isChangeFromDate === false ? oldFromDate : fromDateTimestamp,
                    toDate: isChangeToDate === false ? oldToDate : toDateTimestamp,
                    codeVoucher: codeVoucher,
                    id: id
                })
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage);
                    this.props.fetchAllVouchers();
                } else {
                    toast.error(res.errMessage)
                    this.props.fetchAllVouchers();
                }
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
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["codeVoucher", "typeVoucherId", "fromDate", "toDate", "number"]
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                toast.error(<FormattedMessage id={"required-field"} /> + arrCheck[i])
                break;
            }
        }
        return isValid;
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    handleOnChangeDatePickerFromDate = (date) => {
        this.setState({
            fromDate: date[0],
            isChangeFromDate: true,
        })
    }
    handleOnChangeDatePickerToDate = (date) => {
        this.setState({
            toDate: date[0],
            isChangeToDate: true,
        })
    }
    handleEditVoucherFromParent = (voucher) => {
        let fromDateConvert = moment.unix(voucher.fromDate / 1000).locale('vi').format('DD/MM/YYYY')
        let toDateConvert = moment.unix(voucher.toDate / 1000).locale('vi').format('DD/MM/YYYY')
        this.setState({
            typeVoucherId: voucher.typeVoucherId,
            number: voucher.number,
            fromDate: fromDateConvert,
            toDate: toDateConvert,
            oldFromDate: voucher.fromDate,
            oldToDate: voucher.toDate,
            codeVoucher: voucher.codeVoucher,
            action: CRUD_ACTIONS.EDIT,
            id: voucher.id,
        })
    }
    render() {
        let { typeVoucherId, fromDate, codeVoucher, number, arrTypeVoucher, toDate } = this.state;
        console.log("check arrTypevoucher: ", arrTypeVoucher);
        return (
            <div className='manage-voucher-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-voucher.title-manage"} />
                </div>
                <div className='manage-voucher-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-voucher.update"} /> : <FormattedMessage id={"manage-voucher.add"} />}
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-voucher.typeVoucherId"} /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'typeVoucherId')}
                                    value={typeVoucherId}
                                >
                                    {arrTypeVoucher && arrTypeVoucher.length > 0 &&
                                        arrTypeVoucher.map((item, index) => {
                                            return (
                                                <option key={index} value={item.id}>
                                                    {item.type === 'percent' ? item.value + "%" : item.value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                                </option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-voucher.number"} /></label>
                                <div className="input-group ">
                                    <input type="number" class="form-control"
                                        value={number}
                                        onChange={(event) => this.onChangeInput(event, 'number')} />
                                </div>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-voucher.codeVoucher"} /></label>
                                <div className="input-group ">
                                    <input type="text" class="form-control"
                                        value={codeVoucher}
                                        onChange={(event) => this.onChangeInput(event, 'codeVoucher')}
                                        readOnly={this.state.action === CRUD_ACTIONS.EDIT ? true : false}
                                    />
                                </div>
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-voucher.fromDate"} /></label>
                                <DatePicker
                                    className='form-control'
                                    onChange={this.handleOnChangeDatePickerFromDate}
                                    value={fromDate}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-voucher.toDate"} /></label>
                                <DatePicker
                                    className='form-control'
                                    onChange={this.handleOnChangeDatePickerToDate}
                                    value={toDate}
                                    minDate={fromDate}
                                />
                            </div>
                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-voucher.edit"} /> : <FormattedMessage id={"manage-voucher.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-voucher.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageVoucher
                                    handleEditVoucherFromParentKey={this.handleEditVoucherFromParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageVoucher);
