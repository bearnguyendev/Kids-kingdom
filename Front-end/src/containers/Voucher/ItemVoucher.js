import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import "./ItemVoucher.scss"
import logoVoucher from "../../assets/logo2.jpg"
class ItemVoucher extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }
    handleSaveVoucher = () => {
        let id = this.props.id
        this.props.sendDataFromVoucherItem(id)
    }
    handleClickApplyVoucherItem = () => {
        let id = this.props.id
        this.props.handleClickApplyVoucher(id)
    }

    render() {
        let { name, maxValue, numberUsed, widthPercent, typeVoucher, isShowUseVoucher, isShowButton, toDate, minValue } = this.props
        return (
            <>
                <div className='item-voucher-container my-3'>
                    <div className='item-voucher-content'>
                        <div className="content-left-voucher">
                            <img src={logoVoucher}></img>
                            <span>{name}</span>
                            <span>HSD: {toDate}</span>
                        </div>
                        <div className="border-center">

                        </div>
                        <div className="content-right-voucher">
                            <div className="box-content-right">
                                <span className="name-voucher"><FormattedMessage id={"voucher.sale"} /> {typeVoucher}</span>
                                {isShowUseVoucher === true &&
                                    <a onClick={() => this.handleClickApplyVoucherItem()} className="use-voucher"><FormattedMessage id={"voucher.used"} /></a>
                                }
                                <span className="max-value-voucher"> {maxValue ? "Giảm tối đa: " + maxValue : ''}</span>
                                <span className="max-value-voucher">Đơn hàng từ: {minValue}</span>
                                <div className="box-percent">
                                    <div className="wrap-percent">
                                        <div style={{ width: `${widthPercent}%` }} className="percent"></div>
                                    </div>
                                    <span className="used-percent"><FormattedMessage id={"voucher.used-voucher"} /> {numberUsed}%</span>
                                </div>
                                {isShowButton === true &&
                                    <button onClick={() => this.handleSaveVoucher()} className="btn-voucher">Lưu</button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemVoucher);
