import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import "./ItemProduct.scss"
import { withRouter } from 'react-router';
import "./ItemProduct.scss"
import { toast } from 'react-toastify';
class ItemProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {


    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }
    handleViewDetailProduct = (product) => {
        this.props.history.push(`/product/${product.id}`)
    }
    handleAddCart(item, userInfo) {
        try {
            if (!userInfo) {
                toast.error(<FormattedMessage id={"home-page.fail-login"} />)
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
        let { index, dataProduct, userInfo } = this.props
        return (
            <div className='item-product-container'>
                <div className='item-product-content'>
                    <div className='section-customize' key={index}
                    >
                        <div className='customize-border'>
                            <div className='outer-bg'>
                                <div className='bg-image section-top-product'
                                    style={{ backgroundImage: `url(${dataProduct.productImageData[0].image})` }}
                                    onClick={() => this.handleViewDetailProduct(dataProduct)}
                                >
                                </div>
                                <div className='discount'>
                                    <div className='discount-percent'>{"-" + dataProduct.percentDiscount + "%"}</div>
                                </div>
                            </div>
                            <div className='top-product-name'
                                onClick={() => this.handleViewDetailProduct(dataProduct)}
                            >
                                <div>{dataProduct.name}</div>
                            </div>
                            <div className='top-product-price'>
                                <span className='top-product-discount-price'>{dataProduct.discountPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                                &#8592;
                                <span className='top-product-original-price'>{dataProduct.originalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} </span>
                            </div>
                            <div className='box-view-cart'>
                                <span title='Xem chi tiết' onClick={() => this.handleViewDetailProduct(dataProduct)}>
                                    {/* <ion-icon name="eye-outline" title={false}></ion-icon> */}
                                    <i className="fas fa-eye"></i>
                                </span>
                                &emsp;&emsp;&emsp;&emsp;&emsp;
                                <span title='Thêm vào giỏ hàng' onClick={() => this.handleAddCart(dataProduct, userInfo)}>
                                    {/* <ion-icon name="cart-outline" title={false}></ion-icon> */}
                                    <i className="fas fa-shopping-cart"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAddItemCart: (data) => dispatch(actions.fetchAddItemCart(data))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemProduct));
