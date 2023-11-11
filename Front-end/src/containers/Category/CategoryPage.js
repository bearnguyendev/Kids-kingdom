import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Select from "react-select";
import "./CategoryPage.scss"
import { withRouter } from 'react-router';
import HomeNav from "../HomePage/HomeNav";
import HomeFooter from "../HomePage/HomeFooter";
import "./CategoryPage.scss"
import ItemProduct from '../Product/ItemProduct';
import { toast } from 'react-toastify';
class CategoryPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataCategory: [],
            arrProduct: [],
            categoryId: '',
            dataBrands: [],
            bandId: '',
            sortName: '',
            sortPrice: '',
            sortPercent: '',
            selectedCategory: '',
            selectedBrand: '',
            valueSearch: "",
            isSelectedSortCreatedAt: 0,
            isSelectedSortView: 0,
            scrollTop: 0,
            arrAges: [],
            selectedAges: []
        }
    }
    async componentDidMount() {
        window.scrollTo(0, 0)
        this.props.fetchAllcodeCategory()
        this.props.fetchAllcodeBrands()
        //this.props.fetchAllcodeAgeUseProduct()
        this.props.fetchProductRedux({
            statusId: "S1",
            categoryId: "ALL",
            brandId: "ALL",
            valueSearch: this.state.valueSearch ? this.state.valueSearch : 'ALL'
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0)
        if (prevProps.listCategory !== this.props.listCategory) {
            let { listCategory } = this.props;
            listCategory = listCategory && listCategory.filter(item => item.status === 0)
            listCategory.unshift({
                createdAt: null,
                keyMap: 'ALL',
                type: "CATEGORY",
                value: "Tất cả",
            })
            let dataSelectCategory = this.buildDataInputSelect(listCategory)
            this.setState({
                dataCategory: dataSelectCategory,
                selectedCategory: dataSelectCategory.find(item => item.value === "ALL")
            })
        }
        if (prevProps.listBrands !== this.props.listBrands) {
            let { listBrands } = this.props;
            listBrands = listBrands && listBrands.filter(item => item.status === 0)
            listBrands.unshift({
                createdAt: null,
                keyMap: "ALL",
                type: "BRAND",
                value: "Tất cả",
            })
            let dataSelectBrand = this.buildDataInputSelect(listBrands)
            this.setState({
                dataBrands: dataSelectBrand,
                selectedBrand: dataSelectBrand.find(item => item.value === "ALL")
            })
        }
        if (prevProps.listProducts !== this.props.listProducts) {
            this.setState({
                arrProduct: this.props.listProducts,
            })
        }
        // if (prevProps.listAges !== this.props.listAges) {
        //     let ageArr = this.props.listAges
        //     this.setState({
        //         arrAges: ageArr,
        //     })
        // }
        // if (prevState.selectedAges !== this.state.selectedAges) {
        //     let { arrProduct, selectedAges } = this.state
        //     if (selectedAges && selectedAges.length > 0) {
        //         for (const iterator of selectedAges) {
        //             arrProduct = arrProduct && arrProduct.length > 0 && arrProduct.filter(item => {
        //                 item.productAgeData && item.productAgeData.length > 0 && item.productAgeData.map(age =>
        //                     age.ageId === iterator.keyMap && age.status === 1)
        //                 return item
        //             })
        //         }
        //         console.log("check select: ", arrProduct);
        //     }
        // }
    }
    buildDataInputSelect = (inputData) => {
        let result = []
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                object.label = item.value
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }
    openPreviewImage = (url) => {
        // if (!this.state.previewImgURL) {
        //     return;
        // }
        this.setState({
            isOpen: true,
            previewImgURL: url
        })
    }
    handleAddCart() {
        try {
            let { dataProduct } = this.state
            let { userInfo } = this.props
            this.props.fetchAddItemCart({
                userId: userInfo.id,
                productId: dataProduct.id,
                quantity: +this.state.quantityProduct,
            })
            this.setState({
                quantityProduct: 1
            })
        } catch (error) {
            console.log(error);
        }
    }
    handleChangeSelect = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = { ...this.state }
        stateCopy[stateName] = selectedOption;
        await this.setState({
            ...stateCopy
        })
        this.props.fetchProductRedux({
            statusId: "S1",
            categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
            brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
            valueSearch: this.state.valueSearch
        })
    }

    handleClickSort = (type, value) => {
        if (type === "sortName") {
            this.setState({
                isSelectedSortCreatedAt: 0,
                isSelectedSortView: 0
            })
            this.props.fetchProductRedux({
                statusId: "S1",
                categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
                brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
                sortName: value === 0 ? true : false,
                valueSearch: this.state.valueSearch
            })
            value === 0 ? toast.success(<FormattedMessage id={"home-page.a-z"} />) : toast.success(<FormattedMessage id={"home-page.z-a"} />)

        }
        if (type === "sortPercent") {
            this.setState({
                isSelectedSortCreatedAt: 0,
                isSelectedSortView: 0
            })
            this.props.fetchProductRedux({
                statusId: "S1",
                categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
                brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
                sortPercent: value === 0 ? true : false,
                valueSearch: this.state.valueSearch
            })
            value === 0 ? toast.success(<FormattedMessage id={"home-page.percent-asc"} />) : toast.success(<FormattedMessage id={"home-page.percent-desc"} />)
        }
        if (type === "sortPrice") {
            this.setState({
                isSelectedSortCreatedAt: 0,
                isSelectedSortView: 0
            })
            this.props.fetchProductRedux({
                statusId: "S1",
                categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
                brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
                sortPrice: value === 0 ? true : false,
                valueSearch: this.state.valueSearch
            })
            value === 0 ? toast.success(<FormattedMessage id={"home-page.price-asc"} />) : toast.success(<FormattedMessage id={"home-page.price-desc"} />)
        }
        if (type === "sortView") {
            this.setState({
                isSelectedSortView: 1,
                isSelectedSortCreatedAt: 0
            })
            this.props.fetchProductRedux({
                statusId: "S1",
                categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
                brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
                sortView: true,
                valueSearch: this.state.valueSearch
            })
        }
        if (type === "sortCreatedAt") {
            this.setState({
                isSelectedSortCreatedAt: 1,
                isSelectedSortView: 0
            })
            this.props.fetchProductRedux({
                statusId: "S1",
                categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
                brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
                sortCreatedAt: "true",
                valueSearch: this.state.valueSearch
            })
        }
    }
    handleOnChangeInput = async (event, id) => {
        if (event.target.value === '') {
            await this.setState({
                valueSearch: "",
                isSelectedSortCreatedAt: 0,
                isSelectedSortView: 0
            })
            this.props.fetchProductRedux({
                statusId: "S1",
                categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
                brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
                valueSearch: this.state.valueSearch ? this.state.valueSearch : 'ALL'
            })
        } else {
            let copyState = { ...this.state }
            copyState[id] = event.target.value
            this.setState({
                ...copyState
            })
        }
    }
    // handleOnClickAge = async (age) => {
    //     let { arrAges } = this.state;
    //     if (arrAges && arrAges.length > 0) {
    //         arrAges = arrAges.map(item => {
    //             if (item.id === age.id) item.status = !item.status;
    //             return item;
    //         })
    //         await this.setState({
    //             arrAges
    //         })
    //         let selectedAges = arrAges.filter(item => item.status === true)
    //         this.setState({
    //             selectedAges
    //         })
    //     }
    // }
    handleClickSearch = () => {
        try {
            let { valueSearch } = this.state
            if (valueSearch === '') {
                toast.error(<FormattedMessage id={"home-page.no-name-product"} />)
            } else {
                this.setState({
                    isSelectedSortCreatedAt: 0,
                    isSelectedSortView: 0
                })
                this.props.fetchProductRedux({
                    statusId: "S1",
                    categoryId: this.state.selectedCategory ? this.state.selectedCategory.value : "ALL",
                    brandId: this.state.selectedBrand ? this.state.selectedBrand.value : "ALL",
                    valueSearch: valueSearch
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    resetFilter = async () => {
        try {
            await this.setState({
                sortName: '',
                sortPrice: '',
                sortPercent: '',
                selectedCategory: this.state.dataCategory.find(item => item.value === "ALL"),
                selectedBrand: this.state.dataBrands.find(item => item.value === "ALL"),
                valueSearch: "",
                isSelectedSortView: 0,
                isSelectedSortCreatedAt: 0,
            })
            this.props.fetchProductRedux({
                statusId: "S1",
                categoryId: "ALL",
                brandId: "ALL",
                valueSearch: this.state.valueSearch ? this.state.valueSearch : 'ALL'
            })
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let { dataCategory, dataBrands, selectedCategory, selectedBrand, arrProduct, isSelectedSortCreatedAt, isSelectedSortView, valueSearch } = this.state
        //arrProduct = arrProduct.concat(arrProduct).concat(arrProduct).concat(arrProduct).concat(arrProduct)
        console.log("check arrProduct: ", this.state);
        return (
            <>
                <HomeNav />
                <div className='category-page'>
                    <div className='category-left-nav'>
                        <div className='title-nav mt-3'>
                            <i className="fas fa-filter"></i>
                            &nbsp;
                            Bộ lọc tìm kiếm
                        </div>
                        <div className='my-2'>Theo danh mục</div>
                        <Select
                            value={selectedCategory}
                            onChange={this.handleChangeSelect}
                            options={dataCategory}
                            name={'selectedCategory'}
                        />
                        <div className='my-2'>Theo thương hiệu</div>
                        <Select
                            value={selectedBrand}
                            onChange={this.handleChangeSelect}
                            options={dataBrands}
                            name={'selectedBrand'}
                        />
                        {/* <div className='my-2'>Theo độ tuổi</div>
                        {arrAges && arrAges.length > 0 && arrAges.map((item, index) => {
                            return (
                                <div className="form-check col my-1">
                                    <input className="form-check-input" type="checkbox" id={item.id} value={item.keyMap}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => this.handleOnClickAge(item)}
                                        checked={item.status === true ? true : false}
                                    />
                                    <label className="form-check-label" htmlFor={item.id} value={item.keyMap}>{item.value}</label>
                                </div>
                            )
                        })} */}
                        <div className='btn-rs-filter'>
                            <button className={isSelectedSortView === 1 ? 'reset-filter active' : 'reset-filter'} onClick={() => this.handleClickSort("sortView")}>Sản phẩm nổi bật</button>
                        </div>
                        <div className='btn-rs-filter'>
                            <button className={isSelectedSortCreatedAt === 1 ? 'reset-filter active' : 'reset-filter'} onClick={() => this.handleClickSort("sortCreatedAt")}>Sản phẩm mới</button>
                        </div>
                        <div className='btn-rs-filter'>
                            <button className='reset-filter' onClick={() => this.resetFilter()}>Đặt lại bộ lọc</button>
                        </div>
                        {/* <ul className="list">
                            {dataCategory && dataCategory.length > 0 &&
                                dataCategory.map((item, index) => {
                                    return (
                                        <li className={item.keyMap === categoryId ? 'active' : ''} style={{ cursor: 'pointer' }} onClick={() => this.handleClickCategory(item.keyMap)} key={index}>
                                            <a>{item.value}</a>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <ul className="list">
                            {dataBrands && dataBrands.length > 0 &&
                                dataBrands.map((item, index) => {
                                    return (
                                        <li className={item.keyMap === bandId ? 'active' : ''} style={{ cursor: 'pointer' }} onClick={() => this.handleClickBrand(item.keyMap)} key={index}>
                                            <a>{item.value}</a>
                                        </li>
                                    )
                                })
                            }
                        </ul> */}
                    </div>
                    <div className='category-right-content'>
                        <div className='category-up-sort'>
                            <div className='list-sort'>
                                <div>Sắp xếp theo</div>
                                <div className="dropdown">
                                    <button className="dropbtn">Giá <i className="fas fa-chevron-down"></i></button>
                                    <ul className="dropdown-content">
                                        <li onClick={() => this.handleClickSort("sortPrice", 0)}>Tăng dần</li>
                                        <li onClick={() => this.handleClickSort("sortPrice", 1)}>Giảm dần</li>
                                    </ul>
                                </div>

                                <div className="dropdown">
                                    <button className="dropbtn">Phần trăm giảm giá <i className="fas fa-chevron-down"></i></button>
                                    <ul className="dropdown-content">
                                        <li onClick={() => this.handleClickSort("sortPercent", 0)}>Tăng dần</li>
                                        <li onClick={() => this.handleClickSort("sortPercent", 1)}>Giảm dần</li>
                                    </ul>
                                </div>
                                <div className="dropdown">
                                    <button className="dropbtn">Tên <i className="fas fa-chevron-down"></i></button>
                                    <ul className="dropdown-content ">
                                        <li onClick={() => this.handleClickSort("sortName", 0)}>A&#8594;Z</li>
                                        <li onClick={() => this.handleClickSort("sortName", 1)}>Z&#8594;A</li>
                                    </ul>
                                </div>
                                <div>
                                    <div className='d-inline-flex' style={{ width: "100%" }}>
                                        <input className="input-search form-control mr-sm-3" type="text" placeholder="Nhập tên sản phẩm tìm kiếm..." aria-label="Search" size="30"
                                            onChange={(event) => this.handleOnChangeInput(event, "valueSearch")}
                                            value={valueSearch === "ALL" ? "" : valueSearch}
                                        />
                                        <button className="btn-search btn btn-outline-info  my-sm-0" type='button'
                                            onClick={() => this.handleClickSearch()}
                                        >Tìm kiếm</button>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='col-3'>
                                <ul class="form-control form-control-sm">
                                    <option ></option>
                                    <option value="true"></option>
                                    <option value="false"></option>
                                </ul>
                            </div>
                            <div className='col-3'>
                                <select class="form-control form-control-sm">
                                    <option >Phần trăm giảm giá</option>
                                    <option value="true">Tăng dần</option>
                                    <option value="false">Giảm dần</option>
                                </select>
                            </div>
                            <div className='col-3'>
                                <select class="form-control form-control-sm">
                                    <option >Tên</option>
                                    <option value="true">A&#8594;Z</option>
                                    <option value="false">Z&#8594;A</option>
                                </select>
                            </div> */}


                        </div>
                        <div className='category-item-product'>
                            {arrProduct && arrProduct.length > 0 ?
                                arrProduct.map((item, index) => {
                                    return (
                                        <ItemProduct
                                            index={index}
                                            dataProduct={item}
                                            userInfo={this.props.userInfo}
                                        />
                                    )
                                })
                                :
                                <div className='d-flex' style={{ color: "red", fontSize: "3rem", margin: "auto" }}>Không có sản phẩm bạn tìm kiếm</div>
                            }
                        </div>
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
        listCategory: state.admin.category,
        listBrands: state.admin.brands,
        listProducts: state.admin.products,
        //listAges: state.admin.ageUseProducts,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAddItemCart: (data) => dispatch(actions.fetchAddItemCart(data)),
        fetchAllcodeCategory: () => dispatch(actions.fetchAllcodeCategory()),
        fetchAllcodeBrands: () => dispatch(actions.fetchAllcodeBrands()),
        fetchProductRedux: (data) => dispatch(actions.fetchAllProducts(data)),
        //fetchAllcodeAgeUseProduct: () => dispatch(actions.fetchAllcodeAgeUseProduct()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryPage));
