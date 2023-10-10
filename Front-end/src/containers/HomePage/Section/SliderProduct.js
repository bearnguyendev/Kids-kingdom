import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Slider from "react-slick";
import { withRouter } from 'react-router';
import * as actions from "../../../store/actions"
import { toast } from 'react-toastify';
class SliderProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrProduct: [],
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevProps.userInfo !== this.props.userInfo) {
        //     this.setState({
        //         user: this.props.userInfo
        //     })
        // }
    }
    componentDidMount() {
    }
    handleViewDetailProduct = (product) => {
        this.props.history.push(`/product/${product.id}`)
    }
    handleAddCart(item, userInfo) {
        try {
            if (!userInfo) {
                toast.error("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng! ")
            } else {
                this.props.fetchAddItemCart({
                    userId: userInfo.id,
                    productId: item.id,
                    quantity: 1,
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    render() {
        let { allProducts, userInfo } = this.props
        //allProducts = allProducts.concat(allProducts)
        return (
            <div className='section-body'>
                <Slider {...this.props.settings}>
                    {allProducts && allProducts.length > 0 &&
                        allProducts.map((item, index) => {
                            return (
                                <div className='section-customize' key={index}

                                >
                                    <div className='customize-border'>
                                        <div className='outer-bg'>
                                            <div className='bg-image section-top-product'
                                                style={{ backgroundImage: `url(${item.productImageData[0].image})` }}
                                                onClick={() => this.handleViewDetailProduct(item)}
                                            >
                                            </div>
                                            <div className='discount'>
                                                <div className='discount-percent'>{"-" + item.percentDiscount + "%"}</div>
                                            </div>
                                        </div>
                                        <div className='top-product-name'
                                            onClick={() => this.handleViewDetailProduct(item)}
                                        >
                                            <div>{item.name}</div>
                                        </div>
                                        <div className='top-product-price'>
                                            <span className='top-product-discount-price'>{item.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                                            &#8592;
                                            <span className='top-product-original-price'>{item.originalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                                        </div>
                                        <div className='box-view-cart'>
                                            <span title='Xem chi tiết' onClick={() => this.handleViewDetailProduct(item)}>
                                                {/* <ion-icon name="eye-outline" title={false}></ion-icon> */}
                                                <i className="fas fa-eye"></i>
                                            </span>
                                            &emsp;&emsp;&emsp;&emsp;&emsp;
                                            <span title='Thêm vào giỏ hàng' onClick={() => this.handleAddCart(item, userInfo)}>
                                                {/* <ion-icon name="cart-outline" title={false}></ion-icon> */}
                                                <i className="fas fa-shopping-cart"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </Slider>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAddItemCart: (data) => dispatch(actions.fetchAddItemCart(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SliderProduct));
