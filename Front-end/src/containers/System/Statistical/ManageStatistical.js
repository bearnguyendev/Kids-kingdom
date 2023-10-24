import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";
import moment from 'moment';
import Chart from './Chart';
import { LIMIT5, USER_ROLE } from '../../../utils';
import Select from 'react-select';
class ManageStatistical extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrTopViewProduct: [],
            userRedux: [],
            genderArr: [],
            male: [],
            feMale: [],
            productRedux: [],
            topProductSales: [],
            dataOrder: [],
            orderSuccessByDay: [],
            money: 0,
            week: moment(moment().toDate(), "MM-DD-YYYY").isoWeek(),
            selectedWeek: this.buildNowWeek(),
            chartData: {
                labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
                datasets: [
                    {
                        label: `Doanh thu tuần thứ ${moment(moment().toDate(), "MM-DD-YYYY").isoWeek()} của năm ${moment().format('YYYY')}`,
                        data: [0, 0, 0, 0, 0, 0, 0],
                        backgroundColor: 'yellow',
                        borderColor: 'green',
                        tension: 0.4,
                        fill: true,
                        pointStyle: 'rect',
                        pointBorderColor: 'blue',
                        pointBackgroundColor: '#fff',
                        showLine: true
                    }
                ]
            }
            // chartData: {}
        }
    }
    // componentWillMount() {
    //     // this.getchartData(); // this should be this.getChartData();
    //this.getChartData();

    // }
    // getChartData() {
    //     // Ajax calls here
    //     this.setState({
    //         chartData: {

    //         }
    //     });
    // }
    componentDidMount() {
        let limit = LIMIT5
        let typeSort = 'view'
        this.props.loadTopProducts(limit, typeSort);
        this.props.fetchUserRedux()
        this.props.fetchProductRedux({
            statusId: "ALL",
            categoryId: "ALL",
            brandId: "ALL",
            valueSearch: "ALL",
            sortCount: true
        })
        this.props.fetchAllOrders('S7')
        this.buildChartData(this.props.orderRedux)
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.topProductRedux !== this.props.topProductRedux) {
            this.setState({
                arrTopViewProduct: this.props.topProductRedux
            })
        }

        if (prevProps.listUsers !== this.props.listUsers) {
            this.buildDataUser(this.props.listUsers)
            this.setState({
                userRedux: this.props.listUsers
            })
        }
        if (prevProps.listProducts !== this.props.listProducts) {
            this.buildDataProductSales(this.props.listProducts)
            this.setState({
                productRedux: this.props.listProducts
            })
        }
        if (prevProps.orderRedux !== this.props.orderRedux) {
            let orderSuccessByDay = this.buildMoneyOrderSuccess(this.props.orderRedux)
            this.setState({
                dataOrder: this.props.orderRedux,
                orderSuccessByDay
            })
            this.buildChartData(this.props.orderRedux)
        }
        if (prevState.week !== this.state.week) {
            this.buildChartData(this.props.orderRedux)
        }
    }
    buildDataProductSales = (data) => {
        if (data && data.length > 0) {
            let arrTemp = []
            for (let i = 0; i < 5; i++) {
                arrTemp.push(data[i]);
            }
            this.setState({
                topProductSales: arrTemp
            })
        }
    }
    buildDataUser = (users) => {
        if (users && users.length > 0) {
            let male = users.filter(item => item.genderId === "M");
            let feMale = users.filter(item => item.genderId === "F");
            this.setState({
                male,
                feMale
            })
        }
    }
    buildMoneyOrderSuccess = (data) => {
        let result = []
        let nowDate = moment.unix(Date.now() / 1000).format('DD/MM/YYYY')
        data && data.length > 0 && data.map(item => {
            let dateSuccess = item.orderDateSuccess ? moment.unix(item.orderDateSuccess / 1000).format('DD/MM/YYYY') : ''
            if (item.statusId === "S7" && this.compareDates(dateSuccess, nowDate) === true) result.push(item)
        })
        return result;
    }
    compareDates = (d1, d2) => {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]); //yyyymmdd
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);
        if (d1 >= d2) return true
        return false
    }
    // Chart
    buildChartData = (inputData) => {
        let labels = this.buildLabels(inputData)
        let data = this.buildData(inputData)
        this.setState({
            chartData: {
                labels,
                datasets: [
                    {
                        label: `Doanh thu tuần thứ ${this.state.week} của năm ${moment().format('YYYY')}`,
                        data,
                        backgroundColor: 'yellow',
                        borderColor: 'green',
                        tension: 0.4,
                        fill: true,
                        pointStyle: 'rect',
                        pointBorderColor: 'blue',
                        pointBackgroundColor: '#fff',
                        showLine: true
                    }
                ]
            }
        })
    }
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    removeDuplicates = (arr) => {
        return arr.filter((item,
            index) => arr.indexOf(item) === index);
    }
    buildNowWeek = () => {
        let result = []
        let now = moment().isoWeek(moment(moment().toDate(), "MM-DD-YYYY").isoWeek())
        let dayOfWeek = `Tuần thứ ${moment(moment().toDate(), "MM-DD-YYYY").isoWeek()}: ${now.clone().weekday(0).format("L")} - ${now.clone().weekday(6).format("L")}`
        let object = {};
        object.label = dayOfWeek
        object.value = moment(moment().toDate(), "MM-DD-YYYY").isoWeek()
        result.push(object)
        return result;
    }
    buildDataWeek = () => {
        let result = []
        for (let i = 1; i <= moment().isoWeeksInYear(); i++) {
            let dayOfWeek = `Tuần thứ ${i}: ${moment().isoWeekYear(moment().year()).isoWeek(i).startOf('week').format("L")} - ${moment().isoWeekYear(moment().year()).isoWeek(i).endOf('week').format("L")}`
            let object = {};
            object.label = dayOfWeek
            object.value = i
            result.push(object)
        }
        return result;
    }
    // buildDataMonth = () => {
    //     let result = []
    //     for (let i = 1; i <= moment.monthsShort().length; i++) {
    //         let dayOfMonth = `Tháng thứ ${i}: ${moment().isoWeekYear(moment().year()).isoWeek(i).startOf('week').format("L")} - ${moment().isoWeekYear(moment().year()).isoWeek(i).endOf('week').format("L")}`
    //         let object = {};
    //         object.label = dayOfWeek
    //         object.value = i
    //         result.push(object)
    //     }
    //     return result;
    // }
    handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption;
        stateCopy['week'] = selectedOption.value
        await this.setState({
            ...stateCopy
        })
    }
    buildLabels = (data) => {
        // let labels = []
        // let dateSuccess = ''
        // let firstDayOfWeek = ''
        // let lastDayOfWeek = ''
        // let isNowWeekday = ''
        // data && data.length > 0 && data.map(item => {
        //     if (item.orderDateSuccess) {
        //         dateSuccess = moment.unix(item.orderDateSuccess / 1000)
        //         firstDayOfWeek = dateSuccess.clone().weekday(0);
        //         lastDayOfWeek = dateSuccess.clone().weekday(6);
        //         isNowWeekday = dateSuccess.isBetween(firstDayOfWeek, lastDayOfWeek, null, '[]');
        //         if (isNowWeekday) {
        //             for (let i = 0; i < 7; i++) {
        //                 labels.push(this.capitalizeFirstLetter(dateSuccess.clone().weekday(i).format("dddd - DD/MM/YYYY")))
        //             }
        //         }
        //     }
        // })
        // labels = this.removeDuplicates(labels)
        let labels = []
        let nowDate = moment().isoWeek(this.state.week)
        console.log("check now:::,", Date.now());
        for (let i = 0; i < 7; i++) {
            labels.push(this.capitalizeFirstLetter(nowDate.clone().weekday(i).format("dddd - DD/MM/YYYY")))
        }
        return labels;
    }
    buildData = (data) => {
        let result = []
        data && data.length > 0 && data.map(item => {
            if (item.orderDateSuccess) {
                let dateSuccess = moment.unix(item.orderDateSuccess / 1000)
                let now = moment().isoWeek(this.state.week);
                let firstDayOfWeek = now.clone().weekday(0);
                let lastDayOfWeek = now.clone().weekday(6);
                let isNowWeekday = now.isBetween(firstDayOfWeek, lastDayOfWeek, null, '[]');
                for (let i = 0; i < 7; i++) {
                    result[i] = result[i] ? result[i] : 0
                    if (isNowWeekday && moment(dateSuccess).isSame(now.clone().weekday(i), 'day')) {
                        result[i] += item.totalPayment > 0 ? item.totalPayment + item.typeShipData.price : item.typeShipData.price
                    }
                }
            }
        })
        console.log("check result: ", result);
        return result;
    }
    // Chart
    render() {
        let { arrTopViewProduct, productRedux, dataOrder, userRedux, topProductSales, orderSuccessByDay, money, week, selectedWeek } = this.state
        console.log("check::: ", moment().daysInMonth(2));
        return (
            <>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Thống kê</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Thông kê một vài thông số</li>
                    </ol>
                    <div className="row">
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-light text-dark mb-4 ">
                                <div className="card-body font-weight-bold d-flex align-items-center justify-content-between bg-primary text-white">
                                    <div>Tổng số sản phẩm</div>
                                    <div>{productRedux && productRedux.length > 0 && productRedux.length}</div>
                                </div>
                                <div className="card-body font-weight-bold d-flex align-items-center justify-content-between bg-success text-white">
                                    <div>Tổng số đơn hàng giao thành công</div>
                                    <div>{dataOrder && dataOrder.length > 0 && dataOrder.length}</div>
                                </div>
                                <div className="card-body font-weight-bold d-flex align-items-center justify-content-between bg-info text-white">
                                    <div>Tổng số người dùng</div>
                                    <div>{userRedux && userRedux.length > 0 && userRedux.length}</div>
                                </div>
                                <div className="card-body font-weight-bold d-flex align-items-center justify-content-between bg-secondary text-white">
                                    <div>Doanh thu hôm nay</div>
                                    {orderSuccessByDay && orderSuccessByDay.length > 0
                                        && orderSuccessByDay.map((item) => {
                                            money += item.totalPayment > 0 ? item.totalPayment + item.typeShipData.price : item.typeShipData.price
                                        })}
                                    <div>{money.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-light text-dark mb-4">
                                <div className="card-body font-weight-bold text-center bg-warning">5 sản phẩm có nhiều lượt mua nhất</div>
                                <div className="card-footer d-flex flex-column">
                                    {topProductSales && topProductSales.length > 0
                                        && topProductSales.map((item) => {
                                            return (
                                                <div className=" text-dark stretched-link">{item.name} - {item.count}</div>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-light text-dark mb-4">
                                <div className="card-body font-weight-bold text-center bg-secondary">5 sản phẩm có nhiều lượt xem nhất</div>
                                <div className="card-footer d-flex flex-column">
                                    {arrTopViewProduct && arrTopViewProduct.length > 0
                                        && arrTopViewProduct.map((item) => {
                                            return (
                                                <div className=" text-dark stretched-link">{item.name} - {item.view}</div>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <div className="card bg-light text-dark mb-4">
                                <div className="card-body font-weight-bold text-center bg-danger">Quản trị viên hệ thống</div>
                                <div className="card-footer d-flex flex-column">
                                    {userRedux && userRedux.length > 0
                                        && userRedux.map((item) => {
                                            return (
                                                <div className="text-dark ">{item.roleId === USER_ROLE.ADMIN && item.lastName + " " + item.firstName}</div>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='d-inline-flex'>Xem doanh thu tuần thứ
                        &nbsp;
                        <input
                            value={week}
                            onChange={(event) => this.setState({ week: +event.target.value })}
                            style={{ outline: "none", width: "15%", border: "1px solid #ced4da" }}
                            type="number"
                        />
                        &nbsp;
                        của năm {moment().format('YYYY')}</div> */}
                    <div className='d-inline-flex'>Chọn tuần của năm {moment().format('YYYY')}:</div>
                    <Select
                        value={selectedWeek}
                        onChange={this.handleChangeSelect}
                        options={this.buildDataWeek()}
                        name={'selectedWeek'}
                        className={'col-3'}
                    />
                    <Chart chartData={this.state.chartData} />
                    <div style={{ width: '100%', height: '100px', backgroundColor: '#f5f5f5' }}></div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        topProductRedux: state.admin.topProducts,
        listUsers: state.admin.users,
        genderRedux: state.admin.genders,
        listProducts: state.admin.products,
        orderRedux: state.admin.orders,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopProducts: (limit, typeSort) => dispatch(actions.fetchTopProducts(limit, typeSort)),
        fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
        fetchProductRedux: (data) => dispatch(actions.fetchAllProducts(data)),
        fetchAllOrders: (statusId) => dispatch(actions.fetchAllOrders(statusId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageStatistical);
