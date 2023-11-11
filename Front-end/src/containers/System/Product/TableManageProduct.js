import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import './TableManageProduct.scss'
import * as actions from '../../../store/actions';
import Select from "react-select";
import { toast } from 'react-toastify';
import { handleChangeStatusProduct } from '../../../services/userService';
import { emitter } from '../../../utils/emitter';
import { CommonUtils } from '../../../utils';

class TableManageProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productRedux: [],
            errMessage: "",
            dataProduct: '',
            selectedProduct: '',
        }
        this.listenToEmitter();
    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            //reset state
            this.setState({
                selectedProduct: ''
            })
        })
    }
    async componentDidMount() {
        this.props.fetchProductRedux({
            statusId: "ALL",
            categoryId: "ALL",
            brandId: "ALL",
            valueSearch: "ALL"
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listProducts !== this.props.listProducts) {
            let copyListProducts = [...this.props.listProducts];
            copyListProducts.unshift({
                createdAt: null,
                name: "Tất cả",
                id: "ALL"
            })
            let dataProduct = this.buildDataInputSelect(copyListProducts)
            this.setState({
                productRedux: this.props.listProducts,
                dataProduct,
                dataExport: this.buildDataExport(this.props.listProducts)
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
        console.log("check selectredOption: ", selectedOption);
        let stateName = name.name;
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }
    handleDeleteProduct = (product) => {
        this.props.deleteAProductRedux(product);
        this.setState({
            selectedProduct: ''
        })
    }
    handleEditProduct = (product) => {
        this.props.handleEditProductFromParentKey(product)
    }
    handleChangeStatusProduct = async (product, type) => {
        try {
            await handleChangeStatusProduct({
                id: product.id,
                type: type
            })
            if (type === 'BAN') {
                toast.success(`Ẩn sản phẩm ${product.name} thành công!`)
                this.props.fetchProductRedux({
                    statusId: "ALL",
                    categoryId: "ALL",
                    brandId: "ALL",
                    valueSearch: "ALL"
                })
            }
            if (type === 'PERMIT') {
                toast.success(`Hiện sản phẩm ${product.name} thành công!`)
                this.props.fetchProductRedux({
                    statusId: "ALL",
                    categoryId: "ALL",
                    brandId: "ALL",
                    valueSearch: "ALL"
                })
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
            toast.error(<FormattedMessage id={"error"} />)
        }
    }
    buildDataExport = (data) => {
        let result = []
        data && data.length > 0 && data.map(item => {
            let arrAge = []
            let object = {}
            if (item.productAgeData && item.productAgeData.length > 0) {
                for (const iterator of item.productAgeData) {
                    iterator.status === 1 && arrAge.push(iterator.AgeUseProductData.value)
                }
            }
            object.Id = item.id
            object.Name = item.name
            object.Brand = item.brandData.value
            object.Category = item.categoryData.value
            object.Warranty = item.warrantyData.value
            object.Origin = item.origin
            object.Material = item.material
            object.Long = item.long
            object.Width = item.width
            object.Height = item.height
            object.Weight = item.weight
            object.Stock = item.stock
            object.View = item.view
            object.Buys = item.count
            object.AgeUseProduct = arrAge && arrAge.length > 0 ? arrAge.join(", ") : "Chưa có dữ liệu độ tuổi sử dụng sản phẩm"
            object.OriginalPrice = item.originalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
            object.PercentDiscount = item.percentDiscount + '%'
            object.DiscountPrice = item.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })
            result.push(object)
        })
        return result
    }
    handleExportExcel = async () => {
        let { dataExport } = this.state
        let nameFile = `ListProduct-${new Date().getTime()}`
        await CommonUtils.exportExcel(dataExport, "Danh sách sản phẩm", nameFile)
    }
    render() {
        let arrProducts = this.state.productRedux;
        let { selectedProduct, dataProduct } = this.state
        arrProducts = selectedProduct && selectedProduct.value !== "ALL" ? arrProducts.filter(item => item.id === selectedProduct.value) : arrProducts
        return (
            <>
                <div className='row'>
                    <Select
                        value={selectedProduct}
                        onChange={this.handleChangeSelect}
                        options={dataProduct}
                        name={'selectedProduct'}
                        placeholder='Lọc sản phẩm theo tên...'
                        className="col-6"
                    />
                    <div className='col-6' >
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
                <table id='TableManageProduct' className='mt-3'>
                    <tbody>
                        <tr>
                            <th>STT</th>
                            <th><FormattedMessage id={"manage-product.name"} /></th>
                            <th><FormattedMessage id={"manage-product.view"} /></th>
                            <th><FormattedMessage id={"manage-product.stock"} /></th>
                            <th><FormattedMessage id={"manage-product.originalPrice"} /></th>
                            <th><FormattedMessage id={"manage-product.discountPrice"} /></th>
                            <th><FormattedMessage id={"manage-product.percentDiscount"} /></th>
                            <th><FormattedMessage id={"manage-product.status"} /></th>
                            <th><FormattedMessage id={"manage-product.action"} /></th>
                        </tr>
                        {arrProducts && arrProducts.length > 0 &&
                            arrProducts.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.view}</td>
                                        <td>{item.stock}</td>
                                        <td>{item.originalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                        <td>{item.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                                        <td>{item.percentDiscount + '%'}</td>
                                        <td>{item.statusId === 'S1' ? "Hiện" : "Ẩn"} </td>
                                        <td>
                                            <button
                                                className='btn-edit'
                                                onClick={() => this.handleEditProduct(item)}
                                            ><i className="fas fa-pencil-alt"></i></button>
                                            <button
                                                className='btn-delete'
                                                onClick={() => this.handleDeleteProduct(item)}
                                            ><i className="fas fa-trash"></i></button>
                                            {item.statusId === 'S1' ?
                                                <button
                                                    className='btn-change-status-product'
                                                    onClick={() => this.handleChangeStatusProduct(item, "BAN")}
                                                >
                                                    <i className='far fa-eye-slash' title='Ẩn sản phẩm'></i>
                                                </button>
                                                :
                                                <button
                                                    className='btn-change-status-product'
                                                    onClick={() => this.handleChangeStatusProduct(item, "PERMIT")}
                                                >
                                                    <i className='far fa-eye' title='Hiện sản phẩm'></i>
                                                </button>
                                            }
                                        </td>
                                    </tr>
                                )

                            })
                        }
                    </tbody>
                    {arrProducts <= 0 &&
                        <div className='text-center'>
                            <FormattedMessage id={"manage-product.no-data"} />
                        </div>
                    }
                </table>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        listProducts: state.admin.products,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchProductRedux: (data) => dispatch(actions.fetchAllProducts(data)),
        deleteAProductRedux: (data) => dispatch(actions.deleteAProduct(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageProduct);
