import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import ItemVoucher from "../Voucher/ItemVoucher"
import moment from 'moment';
import _ from 'lodash';
class VoucherUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrVoucher: []
        }
    }
    async componentDidMount() {
        this.props.showAvatar()
        window.scrollTo(0, 0)
        let { userId } = this.props
        if (userId) {
            await this.props.fetchAllVoucherByUserId(userId)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.listVoucherByUserId !== this.props.listVoucherByUserId) {
            this.getDataVouchers()
        }
    }
    // compareDates = (d1, d2) => {
    //     var parts = d1.split('/');
    //     var d1 = Number(parts[2] + parts[1] + parts[0]); //yyyymmdd
    //     parts = d2.split('/');
    //     var d2 = Number(parts[2] + parts[1] + parts[0]);
    //     if (d1 <= d2) return true
    //     if (d1 >= d2) return false
    // }
    getDataVouchers = async () => {
        let { listVoucherByUserId } = this.props
        let arrTemp = []
        if (listVoucherByUserId && listVoucherByUserId.length > 0) {
            let nowDate = moment.unix(Date.now() / 1000).format('YYYY/MM/DD')
            listVoucherByUserId.map((item) => {
                let fromDate = moment.unix(item.fromDate / 1000).format('YYYY/MM/DD');
                let toDate = moment.unix(item.toDate / 1000).format('YYYY/MM/DD');
                if (item.number !== item.numberUsed && moment(fromDate).isSameOrBefore(nowDate) === true && moment(toDate).isSameOrAfter(nowDate) === true) {
                    arrTemp.push(item)
                }
            })
        }
        this.setState({
            arrVoucher: arrTemp
        })
    }

    render() {
        let { arrVoucher } = this.state
        return (
            <div className="voucher-user">
                <div className='title-content'>
                    <div className='title-1'>
                        <FormattedMessage id={"user.my-voucher"} />
                    </div>
                </div>
                <div className='list-voucher-user'>
                    {arrVoucher && arrVoucher.length > 0 ?
                        arrVoucher.map((item, index) => {
                            let typeVoucherFormat = item.typeVoucherOfVoucherData.type === 'percent' ? item.typeVoucherOfVoucherData.value + "%" : item.typeVoucherOfVoucherData.value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                            let maxValue = item.typeVoucherOfVoucherData.maxValue ? item.typeVoucherOfVoucherData.maxValue : ''
                            let minValue = item.typeVoucherOfVoucherData.minValue >= 0 ? item.typeVoucherOfVoucherData.minValue : ''
                            return (
                                <ItemVoucher
                                    id={item.id}
                                    width="550px" height="330px"
                                    key={index}
                                    name={item.codeVoucher}
                                    widthPercent={item.numberUsed * 100 / item.number}
                                    maxValue={maxValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                    minValue={minValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                    numberUsed={Math.round((item.numberUsed * 100 / item.number) * 10) / 10}
                                    typeVoucher={typeVoucherFormat}
                                    toDate={moment.unix(item.toDate / 1000).format('DD/MM/YYYY')}
                                />
                            )
                        }) :
                        <div className='text-center'><FormattedMessage id={"user.no-data-voucher"} /></div>
                    }
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        listVoucherByUserId: state.admin.voucherByUserId,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllVoucherByUserId: (userId) => dispatch(actions.fetchAllVoucherByUserId(userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoucherUser);
