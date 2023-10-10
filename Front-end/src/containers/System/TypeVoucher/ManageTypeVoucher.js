import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { createNewTypeVoucherService, editTypeVoucherService } from '../../../services/userService';
import TableManageTypeVoucher from "./TableManageTypeVoucher";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
class ManageTypeVoucher extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            minValue: '',
            maxValue: '',
            action: '',
            id: '',
            type: '',
            arrDiscount: '',
            errMessage: ""
        }
    }
    componentDidMount() {
        this.props.fetchAllTypeVouchers()
        this.props.fetchAllcodeDiscounts()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listTypeVouchers !== this.props.listTypeVouchers) {
            let discountArr = this.props.listDiscount
            this.setState({
                value: '',
                minValue: '',
                maxValue: '',
                type: discountArr && discountArr.length > 0 ? discountArr[0].keyMap : '',
                action: CRUD_ACTIONS.CREATE
            })
        }
        if (prevProps.listDiscount !== this.props.listDiscount) {
            let discountArr = this.props.listDiscount
            this.setState({
                arrDiscount: discountArr,
                type: discountArr && discountArr.length > 0 ? discountArr[0].keyMap : ''
            })
        }
    }
    handleSaveUser = async () => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === false) {
                return;
            }
            let { action } = this.state
            if (action === CRUD_ACTIONS.CREATE) {
                let res = await createNewTypeVoucherService(this.state)
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage);
                    this.props.fetchAllTypeVouchers();
                } else {
                    toast.error(res.errMessage)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                let res = await editTypeVoucherService(this.state)
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage);
                    this.props.fetchAllTypeVouchers();
                } else {
                    toast.error(res.errMessage)
                }
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
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["type", "value", "minValue"]
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Đây là trường bắt buộc: ' + arrCheck[i])
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
    handleEditTypeVoucherFromParent = (typeVoucher) => {
        this.setState({
            value: typeVoucher.value,
            type: typeVoucher.type,
            maxValue: typeVoucher.maxValue,
            minValue: typeVoucher.minValue,
            action: CRUD_ACTIONS.EDIT,
            id: typeVoucher.id,
        })
    }
    render() {
        let { value, minValue, type, arrDiscount, maxValue } = this.state
        return (
            <div className='manage-type-voucher-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-type-voucher.title-manage"} />
                </div>
                <div className='manage-type-voucher-body'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-type-voucher.update"} /> : <FormattedMessage id={"manage-type-voucher.add"} />}
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-type-voucher.type"} /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'type')}
                                    value={type}
                                >
                                    {arrDiscount && arrDiscount.length > 0 &&
                                        arrDiscount.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{item.value}</option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-type-voucher.value"} /></label>
                                <div className="input-group ">
                                    <input type="number" class="form-control"
                                        value={value}
                                        onChange={(event) => this.onChangeInput(event, 'value')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">{type === 'money' ? 'VND' : '%'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-type-voucher.minValue"} /></label>
                                <div className="input-group ">
                                    <input type="number" class="form-control"
                                        value={minValue}
                                        onChange={(event) => this.onChangeInput(event, 'minValue')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">VND</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3'
                                hidden={type === 'money' ? true : false}
                            >
                                <label><FormattedMessage id={"manage-type-voucher.maxValue"} /></label>
                                <div className="input-group ">
                                    <input type="number" class="form-control"
                                        value={maxValue}
                                        onChange={(event) => this.onChangeInput(event, 'maxValue')}
                                        disabled={type === 'money' ? true : false} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">VND</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveUser()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-type-voucher.edit"} /> : <FormattedMessage id={"manage-type-voucher.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-type-voucher.list"} />
                            </div>
                            <div className="card-body rounded">
                                <TableManageTypeVoucher
                                    handleEditTypeVoucherFromParentKey={this.handleEditTypeVoucherFromParent}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        listTypeVouchers: state.admin.typeVouchers,
        listDiscount: state.admin.discounts
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllTypeVouchers: () => dispatch(actions.fetchAllTypeVouchers()),
        fetchAllcodeDiscounts: () => dispatch(actions.fetchAllcodeDiscounts())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageTypeVoucher);
