import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import { history } from '../redux'
import { ToastContainer } from 'react-toastify';


import { adminIsAuthenticated, userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils'

import Home from '../routes/Home';
import HomePage from './HomePage/HomePage';
import Cart from './Cart/Cart';
import Login from './Auth/Login';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import SignUp from './Auth/SignUp';
import Header from './Header/Header';
import System from '../routes/System';
import ChangePassword from './Auth/ChangePassword';
import { CustomToastCloseButton } from '../components/CustomToast';
import ConfirmModal from '../components/ConfirmModal';
import CustomScrollbars from '../components/CustomScrollbars';
import Order from './Order/Order';
import VoucherPage from './Voucher/VoucherPage';
import User from '../routes/User';
import DetailProduct from './Product/DetailProduct';
import CategoryPage from './Category/CategoryPage';
import DetailBlog from './Blog/DetailBlog';
import ListBlogs from './Blog/ListBlogs';
import ActiveEmail from './User/ActiveEmail';
import PaymentSuccess from './User/PaymentSuccess';
import PaymentFrom from './Order/PaymentFrom';


class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }
    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <div className="content-container">
                            <CustomScrollbars style={{ height: '100vh', width: '100%' }}>
                                <ConfirmModal />
                                <Switch>
                                    <Route path={path.HOME} exact component={(Home)} />
                                    <Route path={path.HOMEPAGE} component={HomePage} />
                                    <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                    <Route path={path.FORGOT_PASSWORD} component={userIsNotAuthenticated(ForgotPassword)} />
                                    <Route path={path.RESET_PASSWORD} component={ResetPassword} />
                                    <Route path={path.SIGNUP} component={userIsNotAuthenticated(SignUp)} />
                                    <Route path={path.CHANGE_PASSWORD} component={userIsAuthenticated(ChangePassword)} />
                                    <Route path={path.VERIFY_EMAIL} component={userIsAuthenticated(ActiveEmail)} />
                                    <Route path={path.WELCOME_SYSTEM} component={adminIsAuthenticated(System)} />
                                    <Route path={path.CART} component={userIsAuthenticated(Cart)} />
                                    <Route path={path.ORDER} component={userIsAuthenticated(Order)} />
                                    <Route path={path.VOUCHER} component={VoucherPage} />
                                    <Route path={path.CATEGORY} component={CategoryPage} />
                                    <Route path={path.DETAIL_PRODUCT} component={DetailProduct} />
                                    <Route path={path.BLOG} component={ListBlogs} />
                                    <Route path={path.DETAIL_BLOG} component={DetailBlog} />
                                    <Route path={path.PAYMENT_SUCCESS} component={userIsAuthenticated(PaymentSuccess)} />
                                    <Route path={path.PAYMENT_FROM} component={userIsAuthenticated(PaymentFrom)} />
                                    <Route path={path.USER} component={userIsAuthenticated(User)} />
                                    <Route component={() => { return (<Redirect to={path.HOME} />) }} />
                                </Switch>
                            </CustomScrollbars>
                        </div>
                        <ToastContainer
                            className="toast-container"
                            toastClassName="toast-item"
                            bodyClassName="toast-item-body"
                            autoClose={2000}
                            hideProgressBar={false}
                            pauseOnHover={false}
                            pauseOnFocusLoss={true}
                            closeOnClick={false}
                            draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        />
                        {/* <ToastContainer
                            position="bottom-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                        /> */}
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);