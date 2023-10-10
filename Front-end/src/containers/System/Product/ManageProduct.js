import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createNewProduct, editProductService } from '../../../services/userService';
import * as actions from "../../../store/actions";
import { CommonUtils, CRUD_ACTIONS } from '../../../utils';
import { emitter } from "../../../utils/emitter"
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { toast } from 'react-toastify';
import "./ManageProduct.scss";
import TableManageProduct from './TableManageProduct';
import { Link } from 'react-router-dom';
const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            origin: '',
            material: '',
            categoryId: '',
            arrCategory: '',
            brandId: '',
            arrBrands: '',
            warrantyId: '',
            arrWarranties: '',
            arrAges: '',
            dataAgesItem: '',
            shortDes: '',
            nameDetail: '',
            width: '',
            height: '',
            weight: '',
            stock: '',
            originalPrice: '',
            percentDiscount: '',
            discountPrice: '',
            image: '',
            previewImgURL: '',
            isOpen: '',
            desMarkdown: '',
            desHTML: '',
            action: '',
            id: '',
            oldImage: '',
            errMessage: ""
        }
    }
    componentDidMount() {
        this.props.fetchAllcodeCategory()
        this.props.fetchAllcodeBrands()
        this.props.fetchAllcodeWarranties()
        this.props.fetchAllcodeAgeUseProduct()
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        window.scrollTo(0, 0);
        if (prevState.percentDiscount !== this.state.percentDiscount || prevState.originalPrice !== this.state.originalPrice) {
            let { originalPrice, percentDiscount } = this.state;
            let discountPrice = originalPrice - (originalPrice * percentDiscount / 100)
            if (discountPrice < 0 || discountPrice > originalPrice) {
                alert(`Phần trăm giảm giá bạn vừa nhập là ${percentDiscount}% không hợp lệ!`);
                this.setState({
                    percentDiscount: '',
                })
            }
            this.setState({
                discountPrice: discountPrice
            })
        }
        if (prevProps.listCategory !== this.props.listCategory) {
            let categoryArr = this.props.listCategory
            this.setState({
                arrCategory: categoryArr,
                categoryId: categoryArr && categoryArr.length > 0 ? categoryArr[0].keyMap : ''
            })
        }
        if (prevProps.listBrands !== this.props.listBrands) {
            let brandArr = this.props.listBrands
            this.setState({
                arrBrands: brandArr,
                brandId: brandArr && brandArr.length > 0 ? brandArr[0].keyMap : ''
            })
        }
        if (prevProps.listWarranties !== this.props.listWarranties) {
            let warrantyArr = this.props.listWarranties
            this.setState({
                arrWarranties: warrantyArr,
                warrantyId: warrantyArr && warrantyArr.length > 0 ? warrantyArr[0].keyMap : ''
            })
        }
        if (prevProps.listAges !== this.props.listAges) {
            let ageArr = this.props.listAges
            this.setState({
                arrAges: ageArr,
            })
        }
        if (prevProps.listProducts !== this.props.listProducts) {
            let warrantyArr = this.props.listWarranties
            let brandArr = this.props.listBrands
            let categoryArr = this.props.listCategory
            let arrAges = this.props.listAges
            arrAges.map(item => item.status = '')
            this.setState({
                name: '',
                origin: '',
                material: '',
                shortDes: '',
                nameDetail: '',
                long: '',
                width: '',
                height: '',
                weight: '',
                stock: '',
                arrAges,
                originalPrice: '',
                percentDiscount: '',
                discountPrice: '',
                image: '',
                previewImgURL: '',
                desMarkdown: '',
                desHTML: '',
                dataAgesItem: '',
                categoryId: categoryArr && categoryArr.length > 0 ? categoryArr[0].keyMap : '',
                brandId: brandArr && brandArr.length > 0 ? brandArr[0].keyMap : '',
                warrantyId: warrantyArr && warrantyArr.length > 0 ? warrantyArr[0].keyMap : '',
                action: CRUD_ACTIONS.CREATE
            })
            window.scrollTo(0, 0)
        }
    }
    handleEditorChange = ({ html, text }) => {

        this.setState({
            desMarkdown: text,
            desHTML: html,
        })
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state }
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }
    checkValidateInput = () => {
        let isValid = true
        let arrCheck = ['name', 'origin', 'material', 'categoryId', 'brandId',
            'warrantyId', 'shortDes', 'nameDetail', 'long', 'width', 'height', 'weight', 'originalPrice', 'percentDiscount', 'desMarkdown', 'desHTML']
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert('Đây là trường bắt buộc: ' + arrCheck[i])
                break;
            }
        }
        return isValid;
    }
    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file)
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                image: base64
            })
        }
    }
    openPreviewImage = () => {
        if (!this.state.previewImgURL) {
            return;
        }
        this.setState({
            isOpen: true
        })
    }
    handleOnClickAge = (age) => {
        let { arrAges } = this.state;
        if (arrAges && arrAges.length > 0) {
            arrAges = arrAges.map(item => {
                if (item.id === age.id) item.status = !item.status;
                return item;
            })
            this.setState({
                arrAges
            })
        }
    }
    buildDataAgeCreate = (ageItem) => {
        try {
            let copyArrAges = [...ageItem]
            let result = []
            if (copyArrAges && copyArrAges.length > 0) {
                copyArrAges.map(item => {
                    let object = {};
                    if (item.status === true) {
                        object.ageId = item.keyMap;
                        object.status = 1
                        result.push(object)
                    }
                })
            }
            return result
        } catch (error) {
            console.log(error);
        }
    }
    buildDataAgeUpdate = (ageItem) => {
        try {
            let { arrAges, id } = this.state
            let copyArrAges = arrAges
            let result = []
            if (copyArrAges && copyArrAges.length > 0) {
                copyArrAges.map(item => {
                    let object = {};
                    object.productId = id ? id : '';
                    object.ageId = item.keyMap;
                    if (item.status === true) object.status = 1
                    else if (item.status === false) object.status = 0
                    ageItem && ageItem.length > 0 && ageItem.map(ageUseItem => { if (ageUseItem.ageId === item.keyMap) object.id = ageUseItem.id })
                    result.push(object)
                })
            }
            return result
        } catch (error) {
            console.log(error);
        }
    }
    handleSaveProduct = async () => {
        try {
            let isValid = this.checkValidateInput()
            if (isValid === false) {
                return;
            }
            let { action, dataAgesItem, arrAges } = this.state
            if (action === CRUD_ACTIONS.CREATE) {
                let arrAgeUseProduct = this.buildDataAgeCreate(arrAges)
                let state = { ...this.state, arrAgeUseProduct }
                let res = await createNewProduct(state)
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage)
                    this.props.fetchProductRedux({
                        statusId: "ALL",
                        categoryId: "ALL",
                        brandId: "ALL",
                        valueSearch: "ALL"
                    })
                } else {
                    toast.error(res.errMessage)
                }
            }
            if (action === CRUD_ACTIONS.EDIT) {
                console.log("check dataAgesItem EDIT: ", dataAgesItem);
                let arrAgeUseProduct = this.buildDataAgeUpdate(dataAgesItem)
                let state = { ...this.state, arrAgeUseProduct }
                let res = await editProductService(state)
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage)
                    this.props.fetchProductRedux({
                        statusId: "ALL",
                        categoryId: "ALL",
                        brandId: "ALL",
                        valueSearch: "ALL"
                    })
                    emitter.emit('EVENT_CLEAR_MODAL_DATA')
                } else {
                    toast.error(res.errMessage)
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    this.setState({
                        errMessage: error.response.data.message
                    })
                }
            }
        }

    }
    handleEditProductFromParent = async (product) => {
        let arrAgesCopy = [...this.state.arrAges]
        arrAgesCopy && arrAgesCopy.length > 0 && arrAgesCopy.map(item => item.status = false)
        await this.setState({
            arrAges: arrAgesCopy
        })
        for (const iterator of product.productAgeData) {
            arrAgesCopy && arrAgesCopy.length > 0 &&
                arrAgesCopy.map(item => {
                    if (item.keyMap === iterator.ageId) iterator.status === 1 ? item.status = true : item.status = false
                    return item
                })
        }
        this.setState({
            name: product.name,
            origin: product.origin,
            material: product.material,
            categoryId: product.categoryId,
            brandId: product.brandId,
            warrantyId: product.warrantyId,
            shortDes: product.shortDes,
            nameDetail: product.nameDetail,
            long: product.long,
            width: product.width,
            height: product.height,
            weight: product.weight,
            stock: product.stock,
            dataAgesItem: product.productAgeData,
            originalPrice: product.originalPrice,
            percentDiscount: product.percentDiscount,
            discountPrice: product.discountPrice,
            desMarkdown: product.desMarkdown,
            desHTML: product.desHTML,
            oldImage: product.productImageData[0].image,
            image: product.productImageData[0].image,
            previewImgURL: product.productImageData[0].image,
            action: CRUD_ACTIONS.EDIT,
            id: product.id,
            arrAges: arrAgesCopy
        })
        this.clickBtnMove("add-edit")
    }
    clickBtnMove = (id) => {
        document.getElementById(id).scrollIntoView();
    }
    render() {
        let { name, origin, material, categoryId, arrCategory, brandId, arrBrands, warrantyId, arrWarranties, shortDes, nameDetail, long, width, height, weight, stock, originalPrice, percentDiscount, discountPrice, previewImgURL, isOpen, id, arrAges } = this.state
        console.log("check data: ", this.state);
        return (
            <div className='manage-product-container'>

                <div className='manage-product-body'>

                    <div className='manage-product-nav-vertical'>
                        <ul>
                            <li>
                                <button type="button" onClick={() => this.clickBtnMove("list")} ><FormattedMessage id={"manage-product.list"} /></button>
                            </li>
                            <li>
                                <button type="button" onClick={() => this.clickBtnMove("add-edit")} >{this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-product.title-update"} /> : <FormattedMessage id={"manage-product.title-add"} />}</button>
                            </li>
                            <li>
                                <button onClick={() => this.clickBtnMove("header")}>Trở về đầu trang</button>
                            </li>
                        </ul>
                    </div>
                    <div className='container'>
                        <div className="card my-4">
                            <div className="card-header" id='list'>
                                <div className="title" >
                                    <FormattedMessage id={"manage-product.list"} />
                                </div>
                            </div>
                            <div className="card-body rounded">
                                <TableManageProduct
                                    handleEditProductFromParentKey={this.handleEditProductFromParent}
                                />
                            </div>
                        </div>
                        <div className="title" id='add-edit'>
                            {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-product.title-update"} /> : <FormattedMessage id={"manage-product.title-add"} />}
                        </div>
                        <div className='row'>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                <FormattedMessage id={"manage-product.info"} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.name"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={name}
                                    onChange={(event) => this.onChangeInput(event, 'name')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.material"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={material}
                                    onChange={(event) => this.onChangeInput(event, 'material')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.origin"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={origin}
                                    onChange={(event) => this.onChangeInput(event, 'origin')}
                                />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.warrantyId"} /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'warrantyId')}
                                    value={warrantyId}
                                >
                                    {arrWarranties && arrWarranties.length > 0 &&
                                        arrWarranties.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{item.value}</option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.categoryId"} /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'categoryId')}
                                    value={categoryId}
                                >
                                    {arrCategory && arrCategory.length > 0 &&
                                        arrCategory.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{item.value}</option>
                                            )
                                        })}
                                </select>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.brandId"} /></label>
                                <select className="form-control"
                                    onChange={(event) => this.onChangeInput(event, 'brandId')}
                                    value={brandId}
                                >
                                    {arrBrands && arrBrands.length > 0 &&
                                        arrBrands.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>{item.value}</option>
                                            )
                                        })}
                                </select>
                            </div>

                            <div className='col-6'>
                                <label><FormattedMessage id={"manage-product.shortDes"} /></label>
                                <textarea
                                    className='form-control'
                                    value={shortDes}
                                    onChange={(event) => this.onChangeInput(event, 'shortDes')}
                                />
                            </div>

                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                <FormattedMessage id={"manage-product.detail-size"} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.long"} /></label>
                                <div className="input-group ">
                                    <input type="number" className="form-control"
                                        value={long}
                                        onChange={(event) => this.onChangeInput(event, 'long')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">cm</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.width"} /></label>
                                <div className="input-group ">
                                    <input type="number" className="form-control"
                                        value={width}
                                        onChange={(event) => this.onChangeInput(event, 'width')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">cm</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.height"} /></label>
                                <div className="input-group ">
                                    <input type="number" className="form-control"
                                        value={height}
                                        onChange={(event) => this.onChangeInput(event, 'height')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">cm</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.weight"} /></label>
                                <div className="input-group ">
                                    <input type="number" className="form-control"
                                        value={weight}
                                        onChange={(event) => this.onChangeInput(event, 'weight')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">kg</span>
                                    </div>
                                </div>
                            </div>
                            {this.state.action === CRUD_ACTIONS.EDIT ?
                                <div className='col-3'>
                                    <label><FormattedMessage id={"manage-product.stock"} /></label>
                                    <br></br>
                                    <label>{stock}</label>
                                    {/* <input type='number'
                                className='form-control'
                                value={stock}
                                onChange={(event) => this.onChangeInput(event, 'stock')}
                            /> */}
                                </div> : <></>

                            }

                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                <FormattedMessage id={"manage-product.age-use-product"} />
                            </div>
                            <div className='container'>
                                <div className='row px-3'>
                                    {arrAges && arrAges.length > 0 && arrAges.map((item, index) => {
                                        return (
                                            <div className="form-check col">
                                                <input className="form-check-input" type="checkbox" id={item.id} value={item.keyMap}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => this.handleOnClickAge(item)}
                                                    checked={item.status === true ? true : false}
                                                />
                                                <label className="form-check-label" htmlFor={item.id} value={item.keyMap}>{item.value}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                <FormattedMessage id={"manage-product.detail-info"} />
                            </div>
                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.nameDetail"} /></label>
                                <input type='text'
                                    className='form-control'
                                    value={nameDetail}
                                    onChange={(event) => this.onChangeInput(event, 'nameDetail')}
                                />
                            </div>

                            <div className='col-3'>
                                <label><FormattedMessage id={"manage-product.originalPrice"} /></label>
                                <div className="input-group ">
                                    <input type="number" className="form-control"
                                        value={originalPrice}
                                        onChange={(event) => this.onChangeInput(event, 'originalPrice')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">VND</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3 '>
                                <label><FormattedMessage id={"manage-product.percentDiscount"} /></label>
                                <div className="input-group ">
                                    <input type="number" className="form-control"
                                        value={percentDiscount}
                                        onChange={(event) => this.onChangeInput(event, 'percentDiscount')} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">%</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-3 '>
                                <label><FormattedMessage id={"manage-product.discountPrice"} /></label>
                                <div className="input-group ">
                                    <input type="text" className="form-control"
                                        value={discountPrice.toLocaleString('it-IT')}
                                        onChange={(event) => this.onChangeInput(event, 'discountPrice')}
                                        disabled={true} />
                                    <div className="input-group-append">
                                        <span className="input-group-text">VND</span>
                                    </div>
                                </div>
                            </div>

                            <div className='col-12 my-2'>
                                <label><FormattedMessage id={"manage-product.des"} /></label>
                                <MdEditor style={{ height: '400px' }} renderHTML={text => mdParser.render(text)} onChange={this.handleEditorChange} value={this.state.desMarkdown} />
                            </div>
                            <div className='col-12 my-3' style={{ fontWeight: '600' }}>
                                <FormattedMessage id={"manage-product.img"} />
                            </div>
                            <div className='col-3'>
                                <div className='preview-img-container'>
                                    <input id='previewImg' type='file' hidden
                                        onChange={(event) => this.handleOnChangeImage(event)} />
                                    <label htmlFor='previewImg' className='label-upload'>
                                        <FormattedMessage id={"manage-user.upload"} /> <i className='fas fa-upload'></i>
                                    </label>
                                    <div className='preview-image rounded'
                                        style={{ backgroundImage: `url(${previewImgURL})` }}
                                        onClick={() => this.openPreviewImage()}
                                    >
                                    </div>
                                </div>
                            </div>
                            {this.state.action === CRUD_ACTIONS.EDIT &&
                                <div className='col-3 my-3 text-center'>
                                    <FormattedMessage id={"manage-product.edit-img"} />&ensp;
                                    <Link to={`/admin/product/image/${id}`}>
                                        &#8594; <FormattedMessage id={"manage-product.click-here"} /> &#8592;
                                    </Link>
                                </div>
                            }
                            <div className='col-12 my-3'>
                                <button
                                    className={this.state.action === CRUD_ACTIONS.EDIT ? 'btn btn-warning px-3' : 'btn btn-primary px-3'}
                                    onClick={() => this.handleSaveProduct()}
                                >
                                    {this.state.action === CRUD_ACTIONS.EDIT ? <FormattedMessage id={"manage-product.edit"} /> : <FormattedMessage id={"manage-product.save"} />}
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
                {
                    isOpen === true &&
                    <Lightbox
                        mainSrc={previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div >
        );
    }

}

const mapStateToProps = state => {
    return {
        listCategory: state.admin.category,
        listBrands: state.admin.brands,
        listWarranties: state.admin.warranties,
        listAges: state.admin.ageUseProducts,
        listProducts: state.admin.products,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllcodeCategory: () => dispatch(actions.fetchAllcodeCategory()),
        fetchAllcodeBrands: () => dispatch(actions.fetchAllcodeBrands()),
        fetchAllcodeWarranties: () => dispatch(actions.fetchAllcodeWarranties()),
        fetchAllcodeAgeUseProduct: () => dispatch(actions.fetchAllcodeAgeUseProduct()),
        fetchProductRedux: (data) => dispatch(actions.fetchAllProducts(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageProduct);
