import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import HomeFooter from '../HomePage/HomeFooter';
import HomeNav from '../HomePage/HomeNav';
import ItemVoucher from './ItemVoucher';
import "./VoucherPage.scss"
import moment from 'moment';
import { saveUserVoucherService } from '../../services/userService';
import { toast } from 'react-toastify';
import { path } from '../../utils';
import { Link } from 'react-router-dom';
class VoucherPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrVoucher: [],
        }
    }
    async componentDidMount() {
        await this.props.fetchAllVouchers()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listVouchers !== this.props.listVouchers) {
            this.getDataVouchers()
        }
    }
    getDataVouchers = async () => {
        let { listVouchers } = this.props
        let arrTemp = []
        if (listVouchers && listVouchers.length > 0) {
            let nowDate = moment.unix(Date.now() / 1000).format('YYYY/MM/DD')
            listVouchers.map((item) => {
                let fromDate = moment.unix(item.fromDate / 1000).format('YYYY/MM/DD');
                let toDate = moment.unix(item.toDate / 1000).format('YYYY/MM/DD');
                // if (item.number !== item.numberUsed && this.compareDates(toDate, nowDate) === false && this.compareDates(fromDate, nowDate) === true) {
                //     arrTemp.push(item)
                // }
                if (item.number !== item.numberUsed && moment(fromDate).isSameOrBefore(nowDate) === true && moment(toDate).isSameOrAfter(nowDate) === true) {
                    arrTemp.push(item)
                }
            })

            // for (let i = 0; i < listVouchers.length; i++) {
            //     let nowDate = moment.unix(Date.now() / 1000).format('DD/MM/YYYY')
            //     let fromDate = moment.unix(listVouchers[i].fromDate / 1000).format('DD/MM/YYYY');
            //     let toDate = moment.unix(listVouchers[i].toDate / 1000).format('DD/MM/YYYY');
            //     if (listVouchers[i].number !== listVouchers[i].numberUsed && this.compareDates(toDate, nowDate) === false && this.compareDates(fromDate, nowDate) === true) {
            //         arrTemp[i] = listVouchers[i]
            //     }
            // }
        }
        this.setState({
            arrVoucher: arrTemp
        })
    }
    compareDates = (d1, d2) => {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]); //yyyymmdd
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);
        if (d1 <= d2) return true
        if (d1 >= d2) return false
    }
    sendDataFromVoucherItem = async (id) => {
        try {
            if (!this.props.userInfo) {
                toast.error(<FormattedMessage id={"voucher.login-to-save"} />)
                setTimeout(() => {
                    window.location.href = path.LOGIN
                }, 3000)
            } else {
                let userId = this.props.userInfo.id
                let res = await saveUserVoucherService({
                    userId: userId,
                    voucherId: id
                })
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage)
                    await this.props.fetchAllVouchers()
                } else {
                    toast.error(res.errMessage)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let { arrVoucher } = this.state
        return (
            <>
                <HomeNav />
                <div className='container voucher-page'>
                    <div className='logo-voucher-page'> </div>
                    <Link to={`user/voucher/${this.props.userInfo && this.props.userInfo.id ? this.props.userInfo.id : ''}`}>
                        <div className='logo-my-voucher'></div>
                    </Link>
                    <div className='list-voucher-page'>
                        {arrVoucher && arrVoucher.length > 0 &&
                            arrVoucher.map((item, index) => {
                                let typeVoucherFormat = item.typeVoucherOfVoucherData.type === 'percent' ? item.typeVoucherOfVoucherData.value + "%" : item.typeVoucherOfVoucherData.value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
                                let maxValue = item.typeVoucherOfVoucherData.maxValue ? item.typeVoucherOfVoucherData.maxValue : ''
                                let minValue = item.typeVoucherOfVoucherData.minValue >= 0 ? item.typeVoucherOfVoucherData.minValue : ''
                                return (
                                    <ItemVoucher
                                        sendDataFromVoucherItem={this.sendDataFromVoucherItem}
                                        id={item.id}
                                        // width="550px" height="330px"
                                        key={index} name={item.codeVoucher}
                                        widthPercent={item.numberUsed * 100 / item.number}
                                        maxValue={maxValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                        minValue={minValue.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                                        numberUsed={Math.round((item.numberUsed * 100 / item.number) * 10) / 10}
                                        typeVoucher={typeVoucherFormat}
                                        isShowButton={true}
                                        toDate={moment.unix(item.toDate / 1000).format('DD/MM/YYYY')}
                                    />
                                )
                            })}
                    </div>
                </div>
                <HomeFooter />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        listVouchers: state.admin.vouchers,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllVouchers: () => dispatch(actions.fetchAllVouchers()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(VoucherPage);
