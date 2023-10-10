import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import Lightbox from 'react-image-lightbox';
import "./DetailProduct.scss"
import { CommonUtils } from '../../utils';
import { getDetailProductById } from '../../services/userService';
import { withRouter } from 'react-router';
import HomeNav from "../HomePage/HomeNav";
import HomeFooter from "../HomePage/HomeFooter";
import Slider from "react-slick";
import "./DetailProduct.scss"
import img from "../../assets/images/Product/icon-chinh-hang.png"
import CommentProduct from './CommentProduct';
import LikeAndShare from '../../components/SocialPlugin/LikeAndShare';
import { toast } from 'react-toastify';
class DetailProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProduct: {},
            quantityProduct: 1,
            nav1: null,
            nav2: null,
            arrAges: [],
            status: '',
        }
    }
    async componentDidMount() {
        window.scrollTo(0, 0)
        this.props.fetchAllcodeAgeUseProduct()
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let productId = this.props.match.params.id
            await this.props.fetchAllCommentByProductIdRedux(productId)
            let res = await getDetailProductById(productId)
            if (res && res.errCode === 0) {
                if (res.data.productImageData && res.data.productImageData.length > 0) {
                    res.data.productImageData.push({
                        image: img,
                        createdAt: null,
                    })
                }
                this.setState({
                    dataProduct: res.data
                })
            }
        }
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2,
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listAges !== this.props.listAges) {
            let { listAges } = this.props
            this.setState({
                arrAges: listAges,
            })
        }
        if (prevState.dataProduct !== this.state.dataProduct) {
            let { listAges } = this.props
            this.buildDateAge(listAges, this.state.dataProduct)
        }
    }
    buildDateAge = (listAges, dataProduct) => {
        let productAgeData = dataProduct.productAgeData && dataProduct.productAgeData
        if (listAges && listAges.length > 0 && productAgeData && productAgeData.length > 0) {
            for (const iterator of listAges) {
                productAgeData.map(item => { if (item.ageId === iterator.keyMap) iterator.status = item.status })
            }
        }
        this.setState({
            arrAges: listAges
        })
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
            if (!userInfo) {
                toast.error("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng! ")
            } else {
                this.props.fetchAddItemCart({
                    userId: userInfo.id,
                    productId: dataProduct.id,
                    quantity: +this.state.quantityProduct,
                })
                this.setState({
                    quantityProduct: 1
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }
    render() {
        let { dataProduct, quantityProduct, isOpen, previewImgURL, arrAges, status } = this.state
        console.log("check dataProduct: ", dataProduct);
        let currentURL = +process.env.REACT_APP_IS_LOCALHOST === 1 ? "https://bearnguyen-restaurant-bot-tv.herokuapp.com/" : window.location.href;
        arrAges = arrAges && arrAges.length > 0 && arrAges.filter(item => item.status === 1)
        return (
            <>
                <HomeNav />
                <div className='container detail-product'>
                    <div className="row">
                        {dataProduct &&
                            <>
                                <div className="col-5">
                                    <div className='image-product'>
                                        <Slider
                                            asNavFor={this.state.nav2}
                                            ref={slider => (this.slider1 = slider)}
                                            arrows={false}
                                            dots={true}
                                        >
                                            {dataProduct.productImageData && dataProduct.productImageData.length > 0 &&
                                                dataProduct.productImageData.map((item, index) => {
                                                    return (
                                                        <div key={index} onClick={() => this.openPreviewImage(item.image)} >
                                                            <div className='bg-image-nav nav1 border border-primary rounded'
                                                                style={{ backgroundImage: `url(${item.image})` }}
                                                            ></div>
                                                            {/* <img height="540px" className="border border-primary rounded" src={item.image} alt="" style={{ cursor: "pointer" }} /> */}
                                                        </div>
                                                    )
                                                })
                                            }

                                        </Slider>
                                        <Slider
                                            asNavFor={this.state.nav1}
                                            ref={slider => (this.slider2 = slider)}
                                            slidesToShow={2}
                                            swipeToSlide={true}
                                            focusOnSelect={true}
                                            arrows={false}
                                        >
                                            {dataProduct.productImageData && dataProduct.productImageData.length > 0 &&
                                                dataProduct.productImageData.map((item, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className='bg-image-nav nav2 border border-info rounded'
                                                                style={{ backgroundImage: `url(${item.image})` }}
                                                            ></div>
                                                            {/* <img height="100px" width={"200px"} className="border border-info rounded mt-5" src={item.image} alt="" style={{ cursor: "pointer" }} /> */}
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Slider>
                                    </div>
                                </div>
                                {/* SAN PHAM : BEGIN */}
                                <div className="col-6 offset-1">
                                    <h2 className='text-capitalize'>{dataProduct.name && dataProduct.name}</h2>
                                    <div className='like-share-plugin'><LikeAndShare dataHref={currentURL} /></div>
                                    <div className='box-price-product'>
                                        <div className='text-danger font-weight-bold'>{dataProduct.discountPrice && dataProduct.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                        <div className='text-muted origin-price'>{dataProduct.originalPrice && dataProduct.originalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
                                        <div className='text-danger'>-{dataProduct.percentDiscount && dataProduct.percentDiscount}%</div>
                                    </div>
                                    <ul className="list-group mb-3">
                                        <li className='list-group-item'>
                                            <i className="fas fa-dollar-sign"></i>
                                            &nbsp;&nbsp;
                                            <span>Hàng chính hãng, chứng nhận an toàn</span>
                                        </li>
                                        <li className='list-group-item'>
                                            <i className="fas fa-box"></i>
                                            &nbsp;&nbsp;
                                            {dataProduct.stock} sản phẩm có sẵn
                                        </li>
                                        <li className='list-group-item'>
                                            <i className="fas fa-phone"></i>
                                            &nbsp;&nbsp;
                                            Liên hệ hỗ trợ: 0000001111
                                        </li>
                                        <li className='list-group-item'>
                                            <span>Loại</span> : {dataProduct.categoryData ? dataProduct.categoryData.value : ''}
                                        </li>
                                        <li className='list-group-item'>
                                            <span>Trạng thái</span> : {dataProduct.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                                        </li>
                                    </ul>
                                    <p>
                                        {dataProduct.shortDes}
                                    </p>
                                    <div style={{ display: 'flex' }}>
                                        <div className="product_count">
                                            <label>Số lượng:</label>
                                            <input className='form-control quantity-product' type="number" value={quantityProduct} onChange={(event) => this.handleOnChangeInput(event, "quantityProduct")} min="1" />
                                        </div>
                                    </div>
                                    <div className="card_area">
                                        <button type="button" className="btn btn-info btn-lg  my-3" onClick={() => this.handleAddCart()} style={{ padding: "20px 20px", lineHeight: "0px" }}>Thêm vào giỏ hàng</button>
                                    </div>
                                </div>
                                {/* SAN PHAM : END */}
                                {/* THONG TIN SAN PHAM  : BEGIN*/}
                                <div>
                                    <h5 className='my-3 font-weight-bold'>Mô tả sản phẩm</h5>
                                    <h3 className='font-weight-bold'>{dataProduct.nameDetail && dataProduct.nameDetail}</h3>
                                    <div style={{ textAlign: "justify", fontSize: "16px" }} dangerouslySetInnerHTML={{ __html: dataProduct.desHTML && dataProduct.desHTML }}></div>
                                </div>
                                <div className='col-12'>
                                    <h5 className='my-3 font-weight-bold'>Thông tin sản phẩm</h5>
                                    <table className="table table-bordered">
                                        <tbody>
                                            <tr>
                                                <th scope="row" className='col-4'>Chiều dài</th>
                                                <td>{dataProduct.long ? dataProduct.long + " cm" : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Chiều rộng</th>
                                                <td>{dataProduct.width ? dataProduct.width + " cm" : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Chiều cao</th>
                                                <td>{dataProduct.height ? dataProduct.height + " cm" : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Trọng lượng</th>
                                                <td>{dataProduct.weight ? dataProduct.weight + " kg" : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Xuất xứ</th>
                                                <td>{dataProduct.origin ? dataProduct.origin : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Chất liệu</th>
                                                <td>{dataProduct.material ? dataProduct.material : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Thương hiệu</th>
                                                <td>{dataProduct.brandData ? dataProduct.brandData.value : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Danh mục</th>
                                                <td>{dataProduct.categoryData ? dataProduct.categoryData.value : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Thời gian bảo hành</th>
                                                <td>{dataProduct.warrantyData ? dataProduct.warrantyData.value : <FormattedMessage id={"detail-product.no-data"} />}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Độ tuổi</th>
                                                <td>
                                                    {arrAges && arrAges.length > 0 ? arrAges.map((age, index) => {
                                                        if (index !== arrAges.length - 1) {
                                                            return <span key={index}>{age.value}{", "}</span>
                                                        } else {
                                                            return <span key={index}>{age.value}{"."}</span>
                                                        }
                                                    })
                                                        : <span><FormattedMessage id={"detail-product.no-data"} /></span>
                                                    }
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* THONG TIN SAN PHAM  : END*/}

                            </>
                        }
                    </div>
                    {/* BINH LUAN SAN PHAM  : BEGIN*/}
                    <div className='comment-product'>
                        <h5 className=' font-weight-bold'>Đánh giá sản phẩm</h5>
                        <CommentProduct
                            userInfo={this.props.userInfo}
                            productId={this.props.match && this.props.match.params && this.props.match.params.id}
                            dataCommentProduct={this.props.dataCommentProduct}
                        />
                    </div>
                    {/* BINH LUAN SAN PHAM  : END*/}
                </div>
                {
                    isOpen === true &&
                    <Lightbox
                        mainSrc={previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
                <HomeFooter />
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        dataCommentProduct: state.admin.commentProduct,
        listAges: state.admin.ageUseProducts,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAddItemCart: (data) => dispatch(actions.fetchAddItemCart(data)),
        fetchAllCommentByProductIdRedux: (id) => dispatch(actions.fetchAllCommentByProductId(id)),
        fetchAllcodeAgeUseProduct: () => dispatch(actions.fetchAllcodeAgeUseProduct()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailProduct));
