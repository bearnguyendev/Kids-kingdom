import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../store/actions";
import "./HomeNav.scss";
import { withRouter } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import _ from 'lodash';
import { path } from '../../utils';
class HomeNav extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrItemOfCart: {}
        }
    }
    async componentDidMount() {
        if (this.props.userInfo) {
            let id = this.props.userInfo.id
            this.props.fetchAllCartByUserId(id)
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({
                arrItemOfCart: this.props.arrItemOfCartRedux
            })
        }
        if (prevProps.arrItemOfCartRedux !== this.props.arrItemOfCartRedux) {
            this.setState({
                arrItemOfCart: this.props.arrItemOfCartRedux
            })
        }
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(path.HOMEPAGE)
        }
    }
    render() {
        const { userInfo, processLogout } = this.props
        let { arrItemOfCart } = this.state
        return (
            <div className='home-nav-container'>
                <div className='home-nav-content'>
                    <div className='left-content'>
                        <div className='nav-logo'
                            onClick={() => this.returnToHome()}>
                        </div>
                    </div>
                    <div className='center-content'>
                        <NavLink to={path.HOMEPAGE} activeClassName="selected">
                            <div className="title-content">Trang chủ</div>
                        </NavLink>
                        <NavLink to={path.CATEGORY} activeClassName="selected" >
                            <div className="title-content">Sản phẩm</div>
                        </NavLink>
                        <NavLink to={path.BLOG} activeClassName="selected" >
                            <div className="title-content">Bài viết</div>
                        </NavLink>
                        <NavLink to={path.VOUCHER} activeClassName="selected" >
                            <div className="title-content">Mã giảm giá</div>
                        </NavLink>
                    </div>
                    <div className='next-center-content'>
                        <div className='support'>
                            <i className="fas fa-question-circle"></i>Hỗ trợ
                        </div>
                        <Link to={path.CART}>
                            <div className='cart'>
                                <ion-icon name="cart-outline" style={{ fontSize: "2rem", color: "#666" }}></ion-icon>
                                <span className="box-quantity-cart">{arrItemOfCart && !_.isEmpty(arrItemOfCart) && arrItemOfCart.ProductUserCartData ? arrItemOfCart.ProductUserCartData.length : 0}</span>
                            </div>
                        </Link>
                    </div>
                    <div className='right-content'>
                        {userInfo ?
                            <>
                                <NavLink to={`/user/detail/${this.props.userInfo.id}`}>
                                    <div className='nav-img' style={{ backgroundImage: `url(${userInfo.image ? userInfo.image : 'https://www.seekpng.com/png/detail/428-4287240_no-avatar-user-circle-icon-png.png'})` }}>
                                    </div>
                                </NavLink >
                                <div className='nav-logout' onClick={processLogout} title="Đăng xuất">
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                            </>
                            :
                            <>
                                <NavLink to={path.LOGIN}>
                                    <div className='nav-login' title="Đăng nhập">
                                        <i className="fas fa-user-alt"></i>
                                    </div>
                                </NavLink>
                                <NavLink to={path.SIGNUP}>
                                    <div className='nav-sign-up' title="Đăng ký">
                                        <i className="fas fa-user-plus"></i>
                                    </div>
                                </NavLink>
                            </>
                        }
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        arrItemOfCartRedux: state.cart.listCartItem
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllCartByUserId: (id) => dispatch(actions.fetchAllCartByUserId(id)),
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeNav));
