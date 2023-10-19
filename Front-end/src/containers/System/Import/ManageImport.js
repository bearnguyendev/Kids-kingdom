import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { CRUD_ACTIONS } from '../../../utils';
import * as actions from "../../../store/actions";
import { editImportService, createNewImportService, getDetailProductById } from '../../../services/userService';
import TableManageImport from "./TableManageImport";
import Select from "react-select";
import 'react-image-lightbox/style.css';
import { toast } from 'react-toastify';
import DatePicker from "../../../components/Input/DatePicker";
import { CommonUtils } from '../../../utils';
import moment from 'moment';
class ManageImport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productId: '',
            priceImport: '',
            quantity: '',
            action: '',
            editId: '',
            selectedProduct: '',
            dataProduct: '',
            nameProduct: '',
            fromDate: '',
            toDate: '',
            isExport: false,
            dataExport: []
        }
    }
    componentDidMount() {
        this.props.fetchAllImports()
        this.props.fetchProductRedux({
            statusId: "ALL",
            categoryId: "ALL",
            brandId: "ALL",
            valueSearch: "ALL"
        })
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.fromDate !== this.state.fromDate || prevState.toDate !== this.state.toDate) {
            let { fromDate, toDate } = this.state
            let result = await this.buildDataExport(this.props.listImports, fromDate, toDate)
            this.setState({
                dataExport: result
            })
        }
        if (prevProps.listImports !== this.props.listImports) {
            this.setState({
                type: '',
                price: '',
                action: CRUD_ACTIONS.CREATE,
                isExport: false,
            })
        }
        if (prevProps.listProducts !== this.props.listProducts) {

            this.setState({
                dataProduct: this.buildDataInputSelect(this.props.listProducts)
            })
        }
    }
    buildDataInputSelect = (inputData) => {
        let result = []
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.name
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }
    handleChangeSelect = (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy,
            productId: selectedOption.value
        })
    }
    handleSaveImport = async () => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === false) {
                return;
            }
            let { action, quantity, priceImport, productId } = this.state
            if (quantity <= 0) {
                toast.error(<FormattedMessage id={"manage-import.err-quantity"} />)
                this.setState({
                    quantity: ''
                })
            } else {
                if (action === CRUD_ACTIONS.CREATE) {
                    // fire redux create 
                    let res = await createNewImportService({
                        quantity,
                        priceImport,
                        productId
                    })
                    if (res && res.errCode === 0) {
                        toast.success(<FormattedMessage id={"manage-import.success"} />);
                        this.props.fetchAllImports();
                    } else {
                        toast.error(res.errMessage)
                    }
                }
                if (action === CRUD_ACTIONS.EDIT) {
                    // fire redux edit 
                    let res = await editImportService({
                        id: this.state.editId,
                        quantity,
                        priceImport,
                        productId,
                    })
                    if (res && res.errCode === 0) {
                        toast.success(<FormattedMessage id={"manage-import.update"} />);
                        this.props.fetchAllImports();
                        this.setState({
                            productId: '',
                            priceImport: '',
                            quantity: '',
                            action: '',
                            selectedProduct: '',
                            dataProduct: '',
                            nameProduct: '',
                        })
                    } else {
                        toast.error(res.errMessage)
                    }
                }
            }

        } catch (error) {
            toast.error(<FormattedMessage id={"error"} />)
        }
    }
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ["priceImport", "quantity"]
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
    handleEditImportFromParent = (importProduct) => {
        this.setState({
            quantity: importProduct.quantity,
            priceImport: importProduct.priceImport,
            action: CRUD_ACTIONS.EDIT,
            editId: importProduct.id,
            productId: importProduct.productId,
            nameProduct: importProduct.importData.name
        })
    }
    handleOnChangeDatePickerFromDate = (date) => {
        this.setState({
            fromDate: date[0],
        })
    }
    handleOnChangeDatePickerToDate = (date) => {
        this.setState({
            toDate: date[0],
        })
    }
    buildDataExport = (data, fromDate, toDate) => {
        let from = fromDate;
        let to = toDate
        let arrTemp = []
        if (data && data.length > 0) {
            let nowDate = moment.unix(Date.now() / 1000).format('YYYY/MM/DD')
            data.map((item) => {
                let fromDate = moment(from).utc("+07:00").format('YYYY/MM/DD');
                let toDate = moment(to).utc("+07:00").format('YYYY/MM/DD');
                if (moment(fromDate).isSameOrBefore(nowDate) === true && moment(toDate).isSameOrAfter(nowDate) === true) {
                    arrTemp.push(item)
                }
            })
        }

        let result = arrTemp && arrTemp.length > 0 && arrTemp.map((item) => ({
            Id: item.id,
            NameProduct: item.importData.name,
            Quantity: item.quantity,
            PriceImport: item.priceImport.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }),
            ImportDate: moment(item.createAt).utc("+07:00").format("L")
        }))
        return result
    }
    handleExportExcel = async () => {
        let { fromDate, toDate } = this.state
        if (fromDate && toDate) {
            let { dataExport } = this.state
            let nameFile = `ListImport-${new Date().getTime()}`
            await CommonUtils.exportExcel(dataExport, "Danh sách nhập hàng", nameFile)
        }
        else {
            alert("Vui lòng chọn thời gian xuất các phiếu nhập!")
        }
    }
    render() {
        let { priceImport, quantity, selectedProduct, dataProduct, nameProduct, fromDate, toDate, isExport } = this.state
        console.log("cjascjsja: ", toDate);
        return (
            <div className='manage-import-container'>
                <div className="title" >
                    <FormattedMessage id={"manage-import.title"} />
                </div>
                <div className='manage-import-body'>
                    <div className='container'>
                        <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                            {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-import.edit-import"} /> : <FormattedMessage id={"manage-import.add"} />}
                        </div>
                        {this.state.action === CRUD_ACTIONS.EDIT ?
                            <label><FormattedMessage id={"manage-import.name"} /></label>
                            :
                            ""}
                        <div className='row'>
                            {this.state.action === CRUD_ACTIONS.EDIT ?
                                <div className='col-6'>
                                    <input type='text'
                                        className='form-control'
                                        value={nameProduct}
                                        readOnly
                                    />
                                </div>
                                :
                                <Select
                                    value={selectedProduct}
                                    onChange={this.handleChangeSelect}
                                    options={dataProduct}
                                    name={'selectedProduct'}
                                    placeholder='Chọn sản phẩm...'
                                    className="col-6"
                                />
                            }
                        </div>
                        <div className='row'>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-import.quantity"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={quantity}
                                    onChange={(event) => this.onChangeInput(event, 'quantity')}
                                />
                            </div>
                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-import.priceImport"} /></label>
                                <div className="input-group ">
                                    <input type="text" className="form-control"
                                        aria-label="Amount (to the nearest dollar)"
                                        value={priceImport}
                                        onChange={(event) => this.onChangeInput(event, 'priceImport')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">VND</span>
                                    </div>
                                </div>
                            </div>

                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveImport()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-import.edit"} /> : <FormattedMessage id={"manage-import.save"} />}
                                </button>
                            </div>
                        </div>
                        <div className="card mb-4">
                            <div className="card-header font-weight-bold">
                                <i className="fas fa-table me-1" />
                                &nbsp;
                                <FormattedMessage id={"manage-import.list"} />
                            </div>

                            {isExport && isExport === true ?
                                <div className='row'>
                                    <div className='col-3'>
                                        <label className='mx-3'>Chọn thời gian cần xuất phiếu nhập</label>

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
                                    <div className='col-3' >
                                        <button className='btn btn-success btn-lg'
                                            style={{
                                                float: "right", width: "7rem", height: "3rem"
                                            }}
                                            onClick={() => this.handleExportExcel()}
                                        >
                                            Xuất
                                            &nbsp;
                                            <i style={{ fontSize: "18px" }} className="fas fa-file-excel"></i>
                                        </button>
                                    </div>
                                </div>
                                :
                                <div className='col-12'>
                                    <button
                                        type="button" className="btn btn-outline-success" style={{
                                            float: "right", width: "11rem", height: "3.5rem"
                                        }}
                                        onClick={() => this.setState({ isExport: true })}
                                    >
                                        Xuất các phiếu nhập
                                    </button>
                                </div>
                            }

                            <div className="card-body rounded">
                                <TableManageImport
                                    handleEditImportFromParentKey={this.handleEditImportFromParent}
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
        listImports: state.admin.imports,
        listProducts: state.admin.products
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllImports: () => dispatch(actions.fetchAllImports()),
        fetchProductRedux: (data) => dispatch(actions.fetchAllProducts(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageImport);
